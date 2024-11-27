export default [
  {
    method: 'GET',
    path: '/strapi/contentTypes',
    handler: 'controller.getContentTypes',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/addEvent',
    handler: 'controller.addEvent',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/validateAWSKey',
    handler: 'controller.validateAWSKey',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/getEvents',
    handler: 'controller.getEvents',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/deleteEvent/:id',
    handler: 'controller.deleteEvent',
    config: {
      policies: [],
    },
  },
];
