export type TAWSConfiguration = {
  awsAccessKey: string;
  awsSecreteKey: string;
  arn: string;
};

export type TStrapiConfiguration = {
  contentType: string;
  event: Array<'afterCreate' | 'beforeCreate'>;
};

export type TPlugin = {
  name: string;
  aws: TAWSConfiguration;
  strapi: TStrapiConfiguration;
  id?: string;
};

export type TContentType = {
  kind: string;
  modelType: string;
  collectionName: string;
  options: {
    draftAndPublish: boolean;
  } & Partial<Record<string, any>>;
  attributes: Record<string, any>;
};

export type TApiContentTypes = Record<string, TContentType>;
