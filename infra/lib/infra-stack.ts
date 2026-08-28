import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'CloudEnergyReadings', {
      tableName: 'CloudEnergyReadings',
      partitionKey: {
        name: 'deviceId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.NUMBER,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const energyQueue = new sqs.Queue(this, 'EnergyQueue', {
      queueName: 'cloud-energy-monitor-queue',
      visibilityTimeout: cdk.Duration.seconds(30),
      retentionPeriod: cdk.Duration.days(4),
    });

    const energyLambda = new lambda.Function(this, 'EnergyLambda', {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'handlers/energy.handler',
      code: lambda.Code.fromAsset('../dist'),
    });

    table.grantReadData(energyLambda);

    const energyProducerLambda = new lambda.Function(
      this,
      'EnergyProducerLambda',
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: 'handlers/energy-producer.handler',
        code: lambda.Code.fromAsset('../dist'),
        environment: {
          QUEUE_URL: energyQueue.queueUrl,
        },
      },
    );

    energyQueue.grantSendMessages(energyProducerLambda);

    const energyConsumerLambda = new lambda.Function(
      this,
      'EnergyConsumerLambda',
      {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: 'handlers/energy-consumer.handler',
        code: lambda.Code.fromAsset('../dist'),
      },
    );

    energyQueue.grantConsumeMessages(energyConsumerLambda);

    energyConsumerLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(energyQueue),
    );

    const api = new apigateway.RestApi(this, 'EnergyApi', {
      restApiName: 'Cloud Energy Monitor API',
    });

    const energyGetIntegration = new apigateway.LambdaIntegration(
      energyLambda,
    );

    const energyPostIntegration = new apigateway.LambdaIntegration(
      energyProducerLambda,
    );

    const energy = api.root.addResource('api').addResource('energy');

    energy.addMethod('GET', energyGetIntegration);

    energy.addMethod('POST', energyPostIntegration);

    const device = energy.addResource('{deviceId}');

    device.addMethod('GET', energyGetIntegration);

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}