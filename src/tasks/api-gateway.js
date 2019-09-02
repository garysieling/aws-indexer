const _ = require('lodash');
const AWS = require('aws-sdk');

const product = (params) => new AWS.ApiGatewayV2(params);

export default { 
  tasks: [
      //['AWS::ApiGateway::Account', product(params).getAccounts().promise()],
      //['AWS::ApiGateway::ApiKey', product(params).listStacks().promise()],
      (params) => ['AWS::ApiGateway::Authorizer', product(params).getAuthorizers().promise()],
      //['AWS::ApiGateway::BasePathMapping', product(params).getBasePathMappings().promise()],
      //['AWS::ApiGateway::ClientCertificate', product(params)().promise()],
      (params) => ['AWS::ApiGateway::Deployment', product(params).listStacks().promise()],
      //['AWS::ApiGateway::DocumentationPart', product(params).getDoc().promise()],
      //['AWS::ApiGateway::DocumentationVersion', product(params).getDocum().promise()],
      (params) => ['AWS::ApiGateway::DomainName', product(params).getDomainNames().promise()],
      (params) => ['AWS::ApiGateway::GatewayResponse', product(params).getIntegrationResponses().promise()],
      //['AWS::ApiGateway::Method', product(params).getMet().promise()],
      (params) => ['AWS::ApiGateway::Model', product(params).getModels().promise()],
      //['AWS::ApiGateway::RequestValidator', product(params).getRE().promise()],
      //['AWS::ApiGateway::Resource', product(params).getREsou().promise()],
      //['AWS::ApiGateway::RestApi', product(params).getRes().promise()],
      //['AWS::ApiGateway::Stage', product(params).listStacks().promise()],
      //['AWS::ApiGateway::UsagePlan', product(params).listStacks().promise()],
      //['AWS::ApiGateway::UsagePlanKey', product(params).getUs().promise()],
      //['AWS::ApiGateway::VpcLink', product(params).listStacks().promise()],
  ]
}
