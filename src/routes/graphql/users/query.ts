import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from "graphql";
import { Context } from "../types/context.js";
import { UserType } from "./type.js";
import { UUIDType } from "../types/uuid.js";

type Args = {
  id: string
};

const users: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(UserType),
  resolve: async (_source, _args, { prisma }) => {
    return await prisma.user.findMany();
  },
};

const user: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  },
};

export const UserQueries = {
  users,
  user
}