import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../pluginId';
import { TPlugin } from '../../../shared/types';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async saveLambdaEvent(key: string, value: TPlugin) {
    const pluginStore = strapi.store({
      type: 'plugin',
      name: PLUGIN_ID,
    });
    try {
      await pluginStore.set({ key, value });
      return 'Store success';
    } catch (error) {
      return new Error(error);
    }
  },
  async getLambdaEvents() {
    try {
      const prefix = `plugin_${PLUGIN_ID}_`;
      const data = await strapi.db.query('strapi::core-store').findMany({
        where: {
          key: { $startsWith: prefix }, // Filter keys starting with the plugin prefix
        },
      });

      const events = data.map((entry) => JSON.parse(entry.value));
      const eventsMapping = events.map((e) => ({
        ...e,
        aws: { ...e.aws, awsSecreteKey: e.aws.awsSecreteKey },
      }));
      return eventsMapping;
    } catch (error) {
      return new Error(error);
    }
  },
  async deleteLambdaEvent(id: string) {
    try {
      const prefix = `plugin_${PLUGIN_ID}_${id}`;
      const data = await strapi.db.query('strapi::core-store').delete({
        where: {
          key: prefix,
        },
      });

      return 'success';
    } catch (error) {
      return new Error(error);
    }
  },
});

export default service;
