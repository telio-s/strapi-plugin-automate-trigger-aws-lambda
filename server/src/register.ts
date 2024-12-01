import type { Core } from '@strapi/strapi';
import dotenv from 'dotenv';

dotenv.config();

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error(
      'Missing required environment variables: ENCRYPTION_KEY for automate trigger AWS Lmabda.'
    );
  }
};

export default register;
