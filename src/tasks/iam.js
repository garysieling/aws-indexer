const _ = require('lodash');
const AWS = require('aws-sdk');

const iam = (params) => new AWS.IAM(params);

// TODO - DAG
export default { 
  tasks: [
    (params) => ['AWS::IAM::User', iam(params).listUsers().promise()],
    (params) => ['AWS::IAM::Group', iam(params).listGroups().promise()],
    (params) => ['AWS::IAM::Role', iam(params).listRoles().promise()],
    (params) => ['AWS::IAM::AccessKey', iam(params).listAccessKeys().promise()],
    (params) => ['AWS::IAM::InstanceProfile', iam(params).listInstanceProfiles().promise()],
    (params) => ['AWS::IAM::Policy', iam(params).listPolicies().promise()],
    // TODO - this is a more or less static list (params) => ['AWS::IAM::ManagedPolicy', iam(params).listPolicies().promise()],
    // TODO - is there a way to list service linked roles? this would be really useful
    // (params) => ['AWS::IAM::ServiceLinkedRole', iam(params)().promise()],

    // This is a hack type in Cloudformation
    //(params) => ['AWS::IAM::UserToGroupAddition', iam(params).listUserToGroupAddition().promise()],

    //(params) => ['AWS::CloudWatch::AnomalyDetector', cloudwatchEvents(params).list],
    //(params) => ['AWS::EC2::ClientVpnRoute', product(params).describeClientVpnRoutes().promise()]
  ]
}

