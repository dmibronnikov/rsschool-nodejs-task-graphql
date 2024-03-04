import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { PostType } from "../posts/type.js";
import { ProfileType } from "../profiles/type.js";
import { User } from "@prisma/client";
import { Context } from "../types/context.js";

export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: { 
      type: new GraphQLList(PostType),
      resolve: async ({ id }, _args, { prisma }) => {
        return await prisma.post.findMany({
          where: {
            authorId: id,
          },
        });
      },
    },
    profile: { 
      type: ProfileType,
      resolve: async ({ id }, _args, { prisma }) => {
        return await prisma.profile.findUnique({
          where: {
            userId: id,
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _args, { prisma }) => {
        return await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }, _args, { prisma }) => {
        return await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        });
      }
    }
  }),
});