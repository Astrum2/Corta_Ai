import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

type TokenPayload = {
    id: number;
};

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            error: "Token não informado!"
        });
    }

    const parts = authorization.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {
        return res.status(401).json({
            error: "Token inválido!"
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as TokenPayload;

        const user = await User.findByPk(
            Number(decoded.id)
        );

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }
        res.locals.authUserId = user.id;

        return next();

    } catch (error) {
        return res.status(401).json({
            error: "Token inválido!"
        });
    }
}

export default authMiddleware;