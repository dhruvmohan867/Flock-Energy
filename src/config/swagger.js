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
        summary: 'Get a list of meters',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Successful response' },
          400: { description: 'Invalid query parameters' },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/meters/{meterId}': {
      get: {
        summary: 'Get a specific meter by ID',
        parameters: [
          { name: 'meterId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Successful response' },
          400: { description: 'Invalid meter ID' },
          500: { description: 'Internal server error' }
        }
      }
    },
    '/meters/{meterId}/geo': {
      get: {
        summary: 'Get geospatial data for a meter',
        parameters: [
          { name: 'meterId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Successful response' }
        }
      }
    },
    '/meters/{meterId}/energy': {
      get: {
        summary: 'Get historical energy readings for a meter',
        parameters: [
          { name: 'meterId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Successful response' }
        }
      }
    },
    '/transformers': {
      get: {
        summary: 'Get a list of transformers',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }
        ],
        responses: {
          200: { description: 'Successful response' }
        }
      }
    }
  }
};

export default function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
