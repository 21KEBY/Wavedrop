import { prisma } from "../db/prisma";

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  createUser: (email: string, hashedPassword: string, username: string) =>
    prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    }),
};
