import type { Core } from '@strapi/strapi';
import dotenv from 'dotenv';
import path from 'path';
// Manually load the .env file from the plugin folder
dotenv.config({
  path: path.resolve(__dirname, '../../.env'), // Make sure the path points to your plugin's .env
});

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
};

export default register;
