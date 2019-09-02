const _ = require('lodash');
const AWS = require('aws-sdk');

const cloudwatch = (params) => new AWS.CloudWatch(params);

const cloudwatchEvents = (params) => new AWS.CloudWatchEvents(params);
const cloudwatchLogs = (params) => new AWS.CloudWatchLogs(params);

// TODO - DAG
export default { 
  tasks: [
    (params) => ['AWS::CloudWatch::Alarm', cloudwatch(params).describeAlarms().promise()],
    (params) => ['AWS::CloudWatch::AnomalyDetector', cloudwatch(params).describeAnomalyDetectors().promise()],
    (params) => ['AWS::CloudWatch::Dashboard', cloudwatch(params).listDashboards().promise()],

    (params) => ['AWS::Logs::Destination', cloudwatchLogs(params).describeDestinations().promise()],
    (params) => ['AWS::Logs::LogGroup', cloudwatchLogs(params).describeLogGroups().promise()],
    (params) => ['AWS::Logs::LogStream', cloudwatchLogs(params).describeLogStreams().promise()],
    (params) => ['AWS::Logs::MetricFilter', cloudwatchLogs(params).describeMetricFilters().promise()],
    (params) => ['AWS::Logs::SubscriptionFilter', cloudwatchLogs(params).describeSubscriptionFilters().promise()],
    

    //(params) => ['AWS::CloudWatch::AnomalyDetector', cloudwatchEvents(params).list],
    //(params) => ['AWS::EC2::ClientVpnRoute', product(params).describeClientVpnRoutes().promise()]
  ]
}

