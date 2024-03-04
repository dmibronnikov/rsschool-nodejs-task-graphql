import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from "graphql";
import { MemberTypeIdType, MemberTypeType } from "./type.js";
import { Context } from "../types/context.js";

type Args = {
  id: string
};

const memberTypes: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLList(MemberTypeType),
  resolve: async (_source, _args, { prisma }) => {
    return await prisma.memberType.findMany();
  },
};

const memberType: GraphQLFieldConfig<void, Context, Args> = {
  type: MemberTypeType,
  args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
  resolve: async (_source, { id }, { prisma }) => {
    return await prisma.memberType.findUnique({ where: { id: id } });
  },
};

export const MemberTypeQueries = {
  memberTypes,
  memberType
};