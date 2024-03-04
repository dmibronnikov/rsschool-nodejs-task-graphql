import { User } from "@prisma/client";
import { GraphQLFieldConfig, GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";
import { Context } from "../types/context.js";
import { UserType } from "./type.js";
import { UUIDType } from "../types/uuid.js";

type CreateUserArgs = {
  dto: Omit<User, 'id'>
};

type ChangeUserArgs = {
  id: string,
  dto: Omit<User, 'id'>
};

type DeleteUserArgs = {
  id: string
};

type SubscribeArgs = {
  userId: string,
  authorId: string
}

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },    
  }),
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },    
  }),
});

const createUser: GraphQLFieldConfig<void, Context, CreateUserArgs> = {
  type: UserType as GraphQLObjectType,
  args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
  resolve: async (_source, args, { prisma }) => {
    return await prisma.user.create({
      data: args.dto,
    });
  },
};

const changeUser: GraphQLFieldConfig<void, Context, ChangeUserArgs> = {
  type: UserType as GraphQLObjectType,
  args: { 
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) } ,
  },
  resolve: async (_source, args, { prisma }) => {
    return await prisma.user.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const deleteUser: GraphQLFieldConfig<void, Context, DeleteUserArgs> = {
  type: new GraphQLNonNull(UUIDType),
  args: { 
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_source, args, { prisma }) => {
    const user = await prisma.user.delete({
      where: {
        id: args.id,
      },
    });
    return user.id;
  },
};

const subscribeTo: GraphQLFieldConfig<void, Context, SubscribeArgs> = {
  type: UserType as GraphQLObjectType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_source, args, { prisma }) => {
    await prisma.user.update({
      where: {
        id: args.userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId: args.authorId,
          },
        },
      },
    });
  },
};

const unsubscribeFrom: GraphQLFieldConfig<void, Context, SubscribeArgs> = {
  type: UUIDType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_source, args, { prisma }) => {
    const subscription = await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: args.userId,
          authorId: args.authorId,
        },
      },
    });
    return subscription.authorId;
  }
} 

export const UserMutations = {
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom
}

