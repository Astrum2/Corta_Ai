import {
    NextFunction,
    Request,
    Response
} from "express";

import User from "../models/User";
import Role from "../models/Roles";
import Permission from "../models/Permission";

function requirePermission(
    permissionName: string
) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authUserId = Number(
                res.locals.authUserId
            );

            if (!Number.isInteger(authUserId)) {
                return res.status(401).json({
                    message:
                        "Usuário não autenticado!"
                });
            }

            const user = await User.findByPk(
                authUserId,
                {
                    include: [
                        {
                            model: Role,
                            as: "role",
                            include: [
                                {
                                    model: Permission,
                                    as: "permissions",
                                    through: {
                                        attributes: []
                                    }
                                }
                            ]
                        }
                    ]
                }
            );

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado!" });
            }

            const role = user.get(
                "role"
            ) as Role & {
                permissions?: Permission[];
            };

            if (!role) {
                return res.status(403).json({ message: "Usuário não possui uma role!" });
            }

            const hasPermission =
                role.permissions?.some( permission => permission.name === permissionName );

            if (!hasPermission) {
                return res.status(403).json({
                    message:
                        "Você não possui permissão para esta ação!"
                });
            }

            return next();

        } catch (error) {
            console.error(
                "Erro ao verificar permissão:",
                error
            );

            return res.status(500).json({
                message:
                    "Erro ao verificar permissão!"
            });
        }
    };
}

export default requirePermission;