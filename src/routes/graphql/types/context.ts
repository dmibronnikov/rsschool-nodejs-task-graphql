import { PrismaClient } from "@prisma/client";

export type Context = {
  prisma: PrismaClient,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loaders: WeakMap<any, any>
};