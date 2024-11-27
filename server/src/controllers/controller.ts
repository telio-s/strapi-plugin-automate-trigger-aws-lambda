import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../pluginId';
import { v4 as uuidv4 } from 'uuid';
import { TApiContentTypes } from '../../../shared/types';
import { TPlugin } from '../../../shared/types';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  getContentTypes(): TApiContentTypes {
    const contentTypes = strapi.contentTypes;
    const apiContentTypes = Object.fromEntries(
      Object.entries(contentTypes).filter(([key]) => key.startsWith('api::'))
    );
    return apiContentTypes;
  },
  async addEvent(ctx) {
    const { body } = ctx.request;
    const id = uuidv4();
    const { iv, encryptedKey } = await strapi
      .plugin(PLUGIN_ID)
      .service('encryption')
      ?.encryptKey(body.aws.awsSecreteKey);
    const data: TPlugin = {
      ...body,
      id,
      aws: {
        ...body.aws,
        awsSecreteKey: { iv, encryptedKey },
      },
    };
    try {
      await strapi
        .plugin(PLUGIN_ID)
        .service('service')
        ?.saveLambdaEvent(id, { ...data });
      ctx.send({ status: 201, message: 'Event created successfully.', body: { ...data } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        ctx.badRequest(error.name);
      } else {
        console.log('[Controller:addEvent] :', error);
      }
    }
  },
  async validateAWSKey(ctx) {
    const { body } = ctx.request;
    try {
      const dryRun = await strapi
        .plugin(PLUGIN_ID)
        .service('awslambda')
        ?.dryRunLambda(
          body.aws.arn,
          body.aws.arn.split(':')[3],
          body.aws.awsAccessKey,
          body.aws.awsSecreteKey
        );
      ctx.send({ status: 200, message: 'AWS key valid.', body: dryRun });
    } catch (error: unknown) {
      if (error instanceof Error) {
        ctx.badRequest(error.name);
        return;
      } else {
        console.log('[Controller:validateAWSKey] :', error);
      }
    }
  },
  async getEvents(ctx) {
    try {
      const events = await strapi.plugin(PLUGIN_ID).service('service')?.getLambdaEvents();
      ctx.send({ status: 200, message: 'Get All events successfully.', body: events });
    } catch (error: unknown) {
      if (error instanceof Error) {
        ctx.badRequest(error.name);
      } else {
        console.log('[Controller:getEvents] Error :', error);
      }
    }
  },
  async deleteEvent(ctx) {
    try {
      const { id } = ctx.params;
      const response = await strapi.plugin(PLUGIN_ID).service('service')?.deleteLambdaEvent(id);
      ctx.send({ status: 200, message: 'Delete a event successfully.', body: response });
    } catch (error: unknown) {
      if (error instanceof Error) {
        ctx.badRequest(error.name);
      } else {
        console.log('[Controller:deleteEvent] Error :', error);
      }
    }
  },
});

export default controller;
