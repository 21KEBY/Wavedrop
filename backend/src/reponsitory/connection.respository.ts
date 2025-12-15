import { prisma } from "../db/prisma";

export const connectionRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
