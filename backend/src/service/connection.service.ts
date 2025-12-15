import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectionRepository } from "../reponsitory/connection.respository";

export const connectionService = {
  async login(email: string, password: string) {
    const user = await connectionRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  },
};
