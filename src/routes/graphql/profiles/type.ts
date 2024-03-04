import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "../types/uuid.js";
import { MemberTypeIdType, MemberTypeType } from "../memberTypes/type.js";
import { Profile } from "@prisma/client";
import { Context } from "../types/context.js";

export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: "Profile",
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdType },
    memberType: { 
      type: MemberTypeType,
      resolve: async ({ memberTypeId }, _args, { prisma }) => {
        return await prisma.memberType.findUnique({
          where: {
            id: memberTypeId,
          },
        });
      },
    },
  }),
});