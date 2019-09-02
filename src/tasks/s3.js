const _ = require('lodash');
const AWS = require('aws-sdk');

const product = (params) => new AWS.S3(params);

export default { 
  tasks: [
    (params) => ['AWS::S3::Bucket', product(params).listBuckets().promise()]
  ]
}
