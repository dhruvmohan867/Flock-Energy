import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Flock Energy REST API',
    version: '1.0.0',
    description: 'Clean REST API wrapper for the legacy electricity management portal.'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1'
    }
  ],
  paths: {
    '/meters': {
      get: {
        summary: 'Search meters',
        tags: ['Meters'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search query by meter ID' }
        ],
        responses: {
          200: {
            description: 'Paginated list of meters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { type: 'object', properties: { meterId: { type: 'string' }, serialNo: { type: 'string' }, make: { type: 'string' }, phaseType: { type: 'string' }, installStatus: { type: 'string' }, dtCode: { type: 'string' } } } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid query parameters' },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/meters/{meterId}': {
      get: {
        summary: 'Get a single meter by ID',
        tags: ['Meters'],
        parameters: [
          { name: 'meterId', in: 'path', required: true, schema: { type: 'string' }, description: 'Meter ID' }
        ],
        responses: {
          200: {
            description: 'Single meter object',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { meterId: { type: 'string' }, serialNo: { type: 'string' }, make: { type: 'string' }, phaseType: { type: 'string' }, installStatus: { type: 'string' }, dtCode: { type: 'string' } }
                }
              }
            }
          },
          400: { description: 'Invalid meter ID' },
          404: { description: 'Meter not found' },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/meters/{meterId}/geo': {
      get: {
        summary: 'Get meter geolocation',
        tags: ['Meters'],
        parameters: [
          { name: 'meterId', in: 'path', required: true, schema: { type: 'string' }, description: 'Meter ID' }
        ],
        responses: {
          200: {
            description: 'Geospatial coordinates of the meter',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'object', properties: { latitude: { type: 'string' }, longitude: { type: 'string' } } }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid meter ID' },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/meters/{meterId}/energy': {
      get: {
        summary: 'Get meter energy history',
        tags: ['Meters'],
        parameters: [
          { name: 'meterId', in: 'path', required: true, schema: { type: 'string' }, description: 'Meter ID' }
        ],
        responses: {
          200: {
            description: 'Historical energy readings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { type: 'object', properties: { timestamp: { type: 'string' }, kwh: { type: 'string' }, kvah: { type: 'string' }, voltR: { type: 'string' } } } }
                  }
                }
              }
            }
          },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/transformers': {
      get: {
        summary: 'Get transformers list',
        tags: ['Transformers'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' }
        ],
        responses: {
          200: {
            description: 'Paginated list of transformers',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { type: 'object', properties: { code: { type: 'string' }, name: { type: 'string' }, feederCode: { type: 'string' }, capacityKva: { type: 'integer' } } } },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid query parameters' },
          500: { description: 'Internal server error' }
        }
      }
    }
  }
};

export default function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
