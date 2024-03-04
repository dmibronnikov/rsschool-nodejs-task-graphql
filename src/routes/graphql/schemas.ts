import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { PostQueries } from './posts/query.js';
import { PostMutations } from './posts/mutation.js';
import { MemberTypeQueries } from './memberTypes/query.js';
import { ProfileQueries } from './profiles/query.js';
import { UserQueries } from './users/query.js';
import { UserMutations } from './users/mutation.js';
import { ProfileMutations } from './profiles/mutation.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...PostQueries,
    ...MemberTypeQueries,
    ...ProfileQueries,
    ...UserQueries,
  }),
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...PostMutations,
    ...UserMutations,
    ...ProfileMutations
  }),
});

export const gqlSchema = new GraphQLSchema({ query, mutation });