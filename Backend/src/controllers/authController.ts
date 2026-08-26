import { Request, Response } from "express";
import User from "../models/User";
import Role from "../models/Roles";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {

    static async login(req: Request, res: Response) {
        const { email, password } = req.body ?? {};

        if (!email || !password) {
            return res.status(400).send({
                message: "E-mail e senha são obrigatórios!"
            });
        }

        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();

        const user = await User.findOne({
            where: {
                email: normalizedEmail
            },

            attributes: ["id", "name", "email", "password", "role_id" ],

            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: [ "id", "name" ]
                }
            ]
        });

        if (!user) {
            return res.status(401).send({
                message: "E-mail ou senha inválidos!"
            });
        }

        const hash = user.password;

        const passwordMatches =
            await bcrypt.compare(
                String(password).trim(),
                hash
            );

        if (!passwordMatches) {
            return res.status(401).send({
                message: "E-mail ou senha inválidos!"
            });
        }
        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        );

        const role = user.get("role") as Role | undefined;

        return res.status(200).send({
            message: "Login realizado com sucesso!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: role ? { id: role.id, name: role.name } : null
            }
        });
    }
}

export default AuthController;