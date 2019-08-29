const _ = require('lodash');
const AWS = require('aws-sdk');

const product = (params) => new AWS.EC2(params);

export default { 
  tasks: [
    (params) => product(params).describeInstances().promise(),
    (params) => product(params).describeInternetGateways().promise(),
    (params) => product(params).describeAvailabilityZones().promise(),
    (params) => product(params).describeAddresses().promise(),
    (params) => product(params).describeClientVpnRoutes().promise()
  ]
}
