const _ = require('lodash');
const AWS = require('aws-sdk');

const lambda = (params) => new AWS.Lambda(params);

// TODO - DAG
export default { 
  tasks: [
    (params) => ['AWS::Lambda::Alias', lambda(params).listAliases().promise()],
    (params) => ['AWS::Lambda::EventSourceMapping', lambda(params).listEventSourceMappings().promise()],
    (params) => ['AWS::Lambda::Function', lambda(params).listFunctions().promise()],
    (params) => ['AWS::Lambda::LayerVersion', lambda(params).listLayerVersions().promise()],
    (params) => ['AWS::Lambda::LayerVersionPermission', lambda(params).listLayers().promise()],
    //(params) => ['AWS::Lambda::Permission', lambda(params).listPermissions().promise()],
    //(params) => ['AWS::Lambda::Version', lambda(params).listVersionsByFunction().promise()],
  ]
}

