import { prisma } from "../db/prisma.ts";

export const connectionRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
