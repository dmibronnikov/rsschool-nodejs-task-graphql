import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from "graphql";
import { Context } from "../types/context.js";
import { PostType } from "./type.js";
import { UUIDType } from "../types/uuid.js";

type Args = {
  id: string
};

const posts: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(PostType),
  resolve: async (_source, _args, { prisma }) => {
    return await prisma.post.findMany()
  },
};

const post: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    return await prisma.post.findUnique({ where: { id } });
  },
};

export const PostQueries = {
  posts,
  post
};