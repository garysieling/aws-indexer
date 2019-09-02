const _ = require('lodash');
const AWS = require('aws-sdk');
const { promisify } = require('util');

//const regions = ['us-east-2', 'us-east-1', 'us-west-1', 'us-west-2', 'ap-east-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'cn-north-1', 'cn-northwest-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1', 'me-south-1', 'sa-east-1', 'us-gov-east-1', 'us-gov-west-1'];
const regions = ['us-east-1'];

console.log(regions);

const services = [
  require('./tasks/cf'),
  require('./tasks/cloudwatch'),
  require('./tasks/dynamodb'),
  require('./tasks/ec2'),
  require('./tasks/iam'),
  require('./tasks/lambda'),
  require('./tasks/rds'),
  require('./tasks/s3'),
  require('./tasks/sns'),
];

// TODO - I think it would make sense to link this all into a graph database
// TODO - Cross account indexing

(async () => {
  const { Client } = require('@elastic/elasticsearch');
  const client = new Client({ node: 'http://localhost:9200' });

  const sts = new AWS.STS();
  const identity = await sts.getCallerIdentity().promise();
    
  const indexName = 'aws-' + identity.accountId;
  try {
    await client.indices.create({index: indexName});
  } catch (e) {
    console.log(e);
  }

  await client.deleteByQuery({ 
    index: indexName,
    body: { query: { match_all: {} } }
  })

  regions.map(
    async (region) => {
      const regionParams = {region};
      const azs = await new AWS.EC2(regionParams).describeAvailabilityZones().promise();
      const azMap = _.fromPairs(azs.AvailabilityZones.map( ({ZoneId, ZoneName}) => [ZoneName, ZoneId]));

      services.map(
        (module) => {
          module.default.tasks.map(
            async (task) => {
              try {
                const [objectType, taskPromise] = task(regionParams);

                console.log('Crawling ' + region + ' ' + objectType);

                const indexData = await taskPromise;

                const justRows = _.pickBy(indexData, (v, k) => _.isArray(v));
                const keys = _.keys(justRows);
                const meta = _.omitBy(indexData, (v, k) => _.isArray(v));

                keys.map(
                  (key) => {
                    //console.log(key)
                    //console.log(indexData);
                    const rows = indexData[key];
                    
                    if (!rows.map) {
                      // TODO: Anything down here should probably be reflected into each row (e.g. "Owner" in S3) 
                      //console.log(JSON.stringify(indexData, null, 2));
                    } else {
                      rows.map(
                        async (row) => {
                          //console.log(row)
                          const toIndex = {};

                          toIndex.data = row;
                          toIndex.metadata = {};
                          toIndex.metadata.region = region;
                          toIndex.metadata.key = key;
                          toIndex.metadata.timestamp = new Date();
                          toIndex.metadata.accountId = identity.Arn;
                          toIndex.metadata.indexedBy = identity.UserId;
                          toIndex.metadata.objectType = objectType;
                          toIndex.metadata.meta = meta;

                          if (row['ZoneName']) {
                            console.log(row['ZoneName'], azMap[row['ZoneName']]);
                            toIndex.metadata.ZoneId = azMap[row['ZoneName']];
                          }

                          if (_.get(row, 'Placement.AvailabilityZone')) {
                            row.Placement.ZoneId = azMap[row.Placement.AvailabilityZone];
                          }

                          //console.log(JSON.stringify(toIndex, null, 2));

                          await client.index({
                            index: 'aws',
                            body: toIndex
                          });
                        }
                      );
                    }
                  }
                )
              } catch (e) {
                console.error(e);
              }
            }
          )
        }
      )
    }
  )
})()

/*
const sns = new AWS.SNS({ endpoint: 'http://localhost:4575', region: 'us-east-1' });
const sqs = new AWS.SQS({ endpoint: 'http://localhost:4576', region: 'us-east-1' });

sns.publish = promisify(sns.publish);
const TopicArn = ''; 
async function publish(msg) {
  const publishParams = {
    TopicArn,
    Message: msg
  };
  let topicRes;
  try {
    topicRes = await sns.publish(publishParams);
  } catch (e) {
    topicRes = e;
  }
  console.log('TOPIC Response: ', topicRes);
}

for (let i = 0; i < 5; i++) {
  publish('message #' + i);
}*/

// TODO: take accounts as inputs
// TODO: expand regions
// TODO: rate limit
/*_.take(
  regions,
  5
).map(
  (region) => {
    // TODO: all list functions
    const lambda = new AWS.Lambda({
      region: region
    });

    console.log(lambda)

    const promise = lambda.listFunctions(
      {
        FunctionVersion: 'ALL',
        MaxItems: 10000
      },
    ).promise()

    // TODO: SQS
    promise.catch(
      (error) => {
        console.log("error");
        console.log(error);
      }
    ).then(
      (data) => { console.log('success') }
    )
  }
)*/
