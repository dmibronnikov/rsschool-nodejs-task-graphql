import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from "graphql";
import { Context } from "../types/context.js";
import { ProfileType } from "./type.js";
import { UUIDType } from "../types/uuid.js";

type Args = {
  id: string
};

const profiles: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(ProfileType),
  resolve: async (_source, _args, { prisma }) => {
    return await prisma.profile.findMany();
  },
};

const profile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, { prisma }) => {
    return await prisma.profile.findUnique({
      where: {
        id: id,
      },
    });
  },
};

export const ProfileQueries = {
  profiles,
  profile
}