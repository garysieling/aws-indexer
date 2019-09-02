const _ = require('lodash');
const AWS = require('aws-sdk');
const product = (params) => new AWS.SNS(params);

export default { 
  tasks: [
    (params) => ['AWS::SNS::Topic', product(params).listTopics().promise()]
  ]
}
