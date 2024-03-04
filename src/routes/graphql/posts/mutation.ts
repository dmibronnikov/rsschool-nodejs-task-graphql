import { Post } from "@prisma/client";
import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { Context } from "../types/context.js";
import { PostType } from "./type.js";
import { UUIDType } from "../types/uuid.js";

type CreatePostArgs = {
  dto: Omit<Post, 'id'>  
};

type ChangePostArgs = {
  id: string,
  dto: Omit<Post, 'id'>
};

type DeletePostArgs = {
  id: string
};

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

const createPost: GraphQLFieldConfig<void, Context, CreatePostArgs> = {
  type: PostType,
  args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
  resolve: async (_source, { dto }, { prisma }) => {
    return await prisma.post.create({ data: dto });
  },
};

const changePost: GraphQLFieldConfig<void, Context, ChangePostArgs> = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) }, 
    dto: { type: new GraphQLNonNull(ChangePostInput) } 
  },
  resolve: async (_source, args, { prisma }) => {
    return await prisma.post.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const deletePost: GraphQLFieldConfig<void, Context, DeletePostArgs> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    const post = await prisma.post.delete({ where: { id: id } });
    return post.id;
  }
}

export const PostMutations = {
  createPost,
  changePost,
  deletePost
};