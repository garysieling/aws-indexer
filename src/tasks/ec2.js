const _ = require('lodash');
const AWS = require('aws-sdk');

const product = (params) => new AWS.EC2(params);

export default { 
  tasks: [
    (params) => ['AWS::EC2::Instance', (async () => {
      console.log('ec2');

      const instances = await product(params).describeInstances().promise();
      console.log(instances);

      return Promise.resolve(_.reduce(
        instances.Reservations.map(
          (reservation) => { return {Groups: reservation.Groups, Instances: reservation.Instances}}
        ),
        (a, b) => {
          return {
            Groups: _.concat(a.Groups, b.Groups),
            Instances: _.concat(a.Instances, b.Instances)
          };
        }));
      })()],
    (params) => ['AWS::EC2::InternetGateway', product(params).describeInternetGateways().promise()],
    (params) => ['AWS::EC2::EIP', product(params).describeAddresses().promise()],
    //(params) => ['AWS::EC2::ClientVpnRoute', product(params).describeClientVpnRoutes().promise()]
  ]
}
