import { prisma } from "../db/prisma.ts";

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  findById: (id: number) =>
    prisma.user.findUnique({
      where: { id },
    }),

  createUser: (email: string, hashedPassword: string, username?: string) =>
    prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: username || null,
      },
    }),
};
