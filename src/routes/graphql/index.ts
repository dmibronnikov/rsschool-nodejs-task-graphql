import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { prisma } = fastify;
      const { query, variables } = req.body;

      const validationErrors = validate(gqlSchema, parse(query), [depthLimit(5)]);
      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      return await graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          loaders: new WeakMap()
        },
      });
    },
  });
};

export default plugin;
