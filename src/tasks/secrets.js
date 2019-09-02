const _ = require('lodash');
const AWS = require('aws-sdk');

const secrets = (params) => new AWS.SecretsManager(params);

// TODO - DAG
export default { 
  tasks: [
    //(params) => ['AWS::SecretsManager::ResourcePolicy', secrets(params).listResourcePolicies().promise()],
    //(params) => ['AWS::SecretsManager::RotationSchedule', secrets(params).listEventSourceMappings().promise()],
    (params) => ['AWS::SecretsManager::Secret', secrets(params).listSecrets().promise()],
    //(params) => ['AWS::SecretsManager::SecretTargetAttachment', secrets(params).listLayerVersions().promise()]
  ]
}

