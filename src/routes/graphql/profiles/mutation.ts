import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLFieldConfig } from "graphql";
import { Context } from "../types/context.js";
import { Profile } from "@prisma/client";
import { MemberTypeIdType } from "../memberTypes/type.js";
import { UUIDType } from "../types/uuid.js";
import { ProfileType } from "./type.js";

type CreateProfileArgs = {
  dto: Omit<Profile, 'id'>
};

type ChangeProfileArgs = {
  id: string,
  dto: Omit<Profile, 'id' | 'userId'>
};

type DeleteProfileArgs = {
  id: string
};

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdType) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdType },
  }),
})

const createProfile: GraphQLFieldConfig<void, Context, CreateProfileArgs> = {
  type: ProfileType,
  args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
  resolve: async (_source, args, { prisma }) => {
    return await prisma.profile.create({
      data: args.dto,
    });
  },
};

const changeProfile: GraphQLFieldConfig<void, Context, ChangeProfileArgs> = {
  type: ProfileType,
  args: { 
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: async (_source, args, { prisma }) => {
    return await prisma.profile.update({
      where: { id: args.id },
      data: args.dto,
    });
  },
};

const deleteProfile: GraphQLFieldConfig<void, Context, DeleteProfileArgs> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, args, { prisma }) => {
    const profile = await prisma.profile.delete({
      where: {
        id: args.id,
      },
    });
    return profile.id;
  },
};

export const ProfileMutations = {
  createProfile,
  changeProfile,
  deleteProfile
};