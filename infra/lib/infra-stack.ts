import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'CloudEnergyReadingsTable', {
      tableName: 'CloudEnergyReadings',
      partitionKey: {
        name: 'deviceId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const energyLambda = new lambda.Function(this, 'EnergyLambda', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'handlers/energy.handler',
      code: lambda.Code.fromAsset('../dist'),
    });

    table.grantReadData(energyLambda);

    const api = new apigateway.LambdaRestApi(this, 'CloudEnergyApi', {
      handler: energyLambda,
      proxy: false,
    });

    const energyResource = api.root
      .addResource('api')
      .addResource('energy');

    energyResource.addMethod('GET');

    energyResource
      .addResource('{deviceId}')
      .addMethod('GET');

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
