import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepository } from "../reponsitory/inscription.respository";

export const authService = {
  async register(email: string, password: string, username: string) {
    const userExists = await authRepository.findByEmail(email);
    if (userExists) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser(email, hashed, username);

    return {
      message: "Inscription réussie",
      user,
    };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Identifiants incorrects.");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Identifiants incorrects.");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      token,
      user,
    };
  },
};
