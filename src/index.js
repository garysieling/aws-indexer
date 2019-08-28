const _ = require('lodash');
const AWS = require('aws-sdk');

const regions = ['us-east-2', 'us-east-1', 'us-west-1', 'us-west-2', 'ap-east-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'cn-north-1', 'cn-northwest-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1', 'me-south-1', 'sa-east-1', 'us-gov-east-1', 'us-gov-west-1'];

console.log(regions);

// TODO: take accounts as inputs
// TODO: expand regions
// TODO: rate limit
_.take(
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
)
