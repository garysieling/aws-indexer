const _ = require('lodash');
const AWS = require('aws-sdk');
const { promisify } = require('util');

const regions = ['us-east-2', 'us-east-1', 'us-west-1', 'us-west-2', 'ap-east-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'cn-north-1', 'cn-northwest-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1', 'me-south-1', 'sa-east-1', 'us-gov-east-1', 'us-gov-west-1'];

console.log(regions);

const services = [
  require('./tasks/cf'),
  //require('./tasks/ec2'),
  //require('./tasks/s3'),
  //require('./tasks/sns')
];

(async () => {
  services.map(
    (module) => {
      module.default.tasks.map(
        async (task) => {
          try {
            const region = 'us-east-1';
            const indexData = await task({region});

            const keys = _.keys(indexData);

            keys.map(
              (key) => {
                console.log(key)
                console.log(indexData)
                const rows = indexData[key];

                if (key !== 'ResponseMetadata') {
                  rows.map(
                    (row) => {
                      const toIndex = {};

                      toIndex.data = row;
                      toIndex.metadata = {};
                      toIndex.metadata.region = region;
                      toIndex.metadata.key = key;
                      toIndex.metadata.timestamp = new Date();

                      console.log(toIndex);
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
