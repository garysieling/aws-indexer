const _ = require('lodash');
const AWS = require('aws-sdk');

const product = (params) => new AWS.CloudFormation(params);

export default { 
  tasks: [
    (params) => 
      ['AWS::Cloudformation::Stack', product(params).listStacks().promise()]
  ]
}
