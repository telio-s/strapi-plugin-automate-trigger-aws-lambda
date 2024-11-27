import type { Core } from '@strapi/strapi';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { PLUGIN_ID } from '../pluginId';

const awslambda = ({ strapi }: { strapi: Core.Strapi }) => ({
  async invokeLambda(
    functionName: string,
    payload: Record<string, any>,
    region: string,
    accessKeyId: string,
    secretAccessKey: { encryptedKey: string; iv: string }
  ) {
    const awsSecreteKey = await strapi
      .plugin(PLUGIN_ID)
      .service('encryption')
      ?.decryptKey(secretAccessKey.encryptedKey, secretAccessKey.iv);
    const lambdaClient = new LambdaClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey: awsSecreteKey,
      },
    });

    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: Buffer.from(JSON.stringify(payload)),
      });

      const response = await lambdaClient.send(command);

      if (response.Payload) {
        const result = JSON.parse(new TextDecoder('utf-8').decode(response.Payload));
        console.log('[Service:invokeLambda] Lambda response :', result);
        return result;
      } else {
        console.log('[Service:invokeLambda] No payload returned from Lambda');
        return null;
      }
    } catch (error) {
      console.error('[Service:invokeLambda] Error invoking Lambda function :', error);
      throw error;
    }
  },
  async dryRunLambda(
    functionName: string,
    region: string,
    accessKeyId: string,
    secretAccessKey: string
  ) {
    const lambdaClient = new LambdaClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: 'DryRun',
      });

      await lambdaClient.send(command);

      return 'success';
    } catch (error) {
      console.error('[Service:dryRunLambda] Error dry run Lambda function :', error);
      throw error;
    }
  },
});

export default awslambda;
