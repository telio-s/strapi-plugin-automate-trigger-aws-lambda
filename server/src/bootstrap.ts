import type { Core } from '@strapi/strapi/src';
import { PLUGIN_ID } from './pluginId';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const dbEvent = await strapi.plugin(PLUGIN_ID).service('service')?.getLambdaEvents();

  strapi.db.lifecycles.subscribe(async (event) => {
    const events: Array<any> = dbEvent;

    for (let i = 0; i < events.length; i++) {
      const thisEvent = events[i];
      const strapiEvent = thisEvent.strapi.event;
      const aws = thisEvent.aws;
      const region = aws.arn.split(':')[3];
      const accessKey = aws.awsAccessKey;
      const secreteKey = aws.awsSecreteKey;
      for (let j = 0; j < strapiEvent.length; j++) {
        if (
          event.action === strapiEvent[j] &&
          thisEvent.strapi.contentType === event.model.tableName
        ) {
          const invokeLambda = await strapi
            .plugin(PLUGIN_ID)
            .service('awslambda')
            ?.invokeLambda(aws.arn, event.params.data, region, accessKey, secreteKey);
        }
      }
    }
  });
};

export default bootstrap;
