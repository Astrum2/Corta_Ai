import { Request, Response } from "express";
import Barber from "../models/Barber";
import User from "../models/User";
import Role from "../models/Roles";

class BarbersController {

    static async createFromData(data: {
        name: string;
        user_id: number;
        phone?: string | null;
        photo?: string | null;
        active?: boolean;
    }) {
        const { name, user_id, phone, photo, active } = data;

        if (!name || String(name).trim().length === 0) {
            throw new Error("Nome é obrigatório!");
        }

        if (!user_id) {
            throw new Error("user_id é obrigatório!");
        }

        const user = await User.findByPk(user_id, {
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["id", "name"]
                }
            ]
        });

        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        const role = user.get("role") as Role;

        if (!role || role.name !== "barber") {
            throw new Error(
                "Somente usuários com a role barber podem possuir perfil de barbeiro!"
            );
        }

        const existingBarber = await Barber.findOne({
            where: {
                user_id
            }
        });

        if (existingBarber) {
            throw new Error(
                "Já existe barbeiro para este usuário!"
            );
        }

        return Barber.create({
            name: String(name).trim(),
            user_id,
            phone: phone ?? null,
            photo: photo ?? null,
            active: active ?? true
        });
    }

    static async updateFromData( barberId: number, data: { name?: string; phone?: string | null; active?: boolean; photo?: string | null; } ) {
        const barber = await Barber.findByPk(barberId);

        if (!barber) {
            throw new Error("Barbeiro não encontrado!");
        }

        return barber.update({
            name: data.name !== undefined ? String(data.name).trim() : barber.name,
            phone: data.phone !== undefined ? data.phone : barber.phone,
            active: data.active !== undefined ? data.active : barber.active,
            photo: data.photo !== undefined ? data.photo : barber.photo
        });
    }

    static async list(req: Request, res: Response) {
        const barbers = await Barber.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [ "id", "name", "email", "cpf", "role_id"],
                    include: [
                        {
                            model: Role,
                            as: "role",
                            attributes: ["id", "name"]
                        }
                    ]
                }
            ]
        });

        return res.send(barbers);
    }

    static async getProfile(req: Request, res: Response) {
        const authUserId = Number(
            res.locals.authUserId
        );

        if (!Number.isInteger(authUserId)) {
            return res.status(401).send({
                message: "Usuário não autenticado!"
            });
        }

        const barber = await Barber.findOne({
            where: {
                user_id: authUserId
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [ "id", "name", "email", "cpf", "role_id"],
                    include: [ { model: Role, as: "role", attributes: ["id", "name"] } ]
                }
            ]
        });

        if (!barber) {
            return res.status(404).send({
                message:
                    "Perfil de barbeiro não encontrado!"
            });
        }

        return res.send(barber);
    }
    static async create(req: Request, res: Response) {
        const { user_id, phone, photo, active } = req.body ?? {};

        if (!user_id) {
            return res.status(400).send({
                message: "user_id é obrigatório!"
            });
        }

        const user = await User.findByPk(
            Number(user_id),
            {
                include: [
                    {
                        model: Role,
                        as: "role",
                        attributes: ["id", "name"]
                    }
                ]
            }
        );

        if (!user) {
            return res.status(404).send({
                message: "Usuário não encontrado!"
            });
        }

        const role = user.get("role") as Role;

        if (!role || role.name !== "barber") {
            return res.status(403).send({
                message:
                    "Este usuário não possui a role barber!"
            });
        }

        const existingBarber = await Barber.findOne({
            where: {
                user_id: user.id
            }
        });

        if (existingBarber) {
            return res.status(409).send({
                message:
                    "Já existe perfil de barbeiro para este usuário!"
            });
        }

        const barber = await Barber.create({
            user_id: user.id,
            name: user.name,
            phone: phone ?? null,
            photo: photo ?? null,
            active: active ?? true
        });

        return res.status(201).send(barber);
    }

    static async updateProfile( req: Request, res: Response ) {
        const authUserId = Number(
            res.locals.authUserId
        );

        if (!Number.isInteger(authUserId)) {
            return res.status(401).send({
                message: "Usuário não autenticado!"
            });
        }

        if ( !req.body || typeof req.body !== "object" ) {
            return res.status(400).send({
                message: "Corpo da requisição inválido!"
            });
        }

        const { phone, active, photo } = req.body;

        const hasPhone =
            Object.prototype.hasOwnProperty.call( req.body, "phone" );

        const hasActive =
            Object.prototype.hasOwnProperty.call( req.body, "active" );

        const hasPhoto =
            Object.prototype.hasOwnProperty.call( req.body, "photo" );

        if ( !hasPhone && !hasActive && !hasPhoto) {
            return res.status(400).send({
                message: "Informe ao menos um campo para atualização!"
            });
        }

        const barber = await Barber.findOne({
            where: {
                user_id: authUserId
            }
        });

        if (!barber) {
            return res.status(404).send({
                message:
                    "Perfil de barbeiro não encontrado!"
            });
        }

        await barber.update({
            phone: hasPhone ? phone : barber.phone,
            active: hasActive ? active : barber.active,
            photo: hasPhoto ? photo : barber.photo
        });

        return res.send(barber);
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;

        const barber = await Barber.findByPk(
            Number(id),
            {
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [ "id", "name", "email", "cpf", "role_id"],
                        include: [
                            {
                                model: Role,
                                as: "role",
                                attributes: [ "id", "name" ]
                            }
                        ]
                    }
                ]
            }
        );

        if (!barber) {
            return res.status(404).send({
                message:
                    "Barbeiro não encontrado!"
            });
        }

        return res.send(barber);
    }

    static async remove(req: Request, res: Response) {
        const { id } = req.params;

        const barber = await Barber.findByPk(
            Number(id)
        );

        if (!barber) {
            return res.status(404).send({
                message:
                    "Barbeiro não encontrado!"
            });
        }

        await barber.destroy();

        return res.status(204).send();
    }
}

export default BarbersController;