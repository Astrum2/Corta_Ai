import { Request, Response } from "express";
import Service from "../models/Service";
import redis from "../redis/redisClient";

const SERVICES_CACHE_KEY = "services:all";
const SERVICE_CACHE_KEY_PREFIX = "services:";
const SERVICES_CACHE_TTL_SECONDS = 300;

const serviceCacheKey = (id: number) => `${SERVICE_CACHE_KEY_PREFIX}${id}`;

async function invalidateServicesCache(id?: number): Promise<void> {
    const keys = [SERVICES_CACHE_KEY];

    if (id !== undefined) {
        keys.push(serviceCacheKey(id));
    }

    try {
        await redis.del(...keys);
    } catch (error) {
        console.error("[Redis Cache] Falha ao invalidar cache de serviços:", error);
    }
}

class ServicesController {

    static async list(req: Request, res: Response) {
        try {
            const cachedServices = await redis.get(SERVICES_CACHE_KEY);

            if (cachedServices) {
                return res.send(JSON.parse(cachedServices));
            }
        } catch (error) {
            console.error("[Redis Cache] Falha ao consultar lista de serviços:", error);
        }

        const services = await Service.findAll();

        try {
            await redis.set(
                SERVICES_CACHE_KEY,
                JSON.stringify(services),
                "EX",
                SERVICES_CACHE_TTL_SECONDS,
            );
        } catch (error) {
            console.error("[Redis Cache] Falha ao armazenar lista de serviços:", error);
        }

        res.send(services);
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const serviceId = Number(id);

        try {
            const cachedService = await redis.get(serviceCacheKey(serviceId));

            if (cachedService) {
                return res.send(JSON.parse(cachedService));
            }
        } catch (error) {
            console.error("[Redis Cache] Falha ao consultar serviço:", error);
        }

        const service = await Service.findByPk(serviceId);

        if (!service) {
            return res.status(404).send({ message: "Serviço não encontrado!" })
        }

        try {
            await redis.set(
                serviceCacheKey(serviceId),
                JSON.stringify(service),
                "EX",
                SERVICES_CACHE_TTL_SECONDS,
            );
        } catch (error) {
            console.error("[Redis Cache] Falha ao armazenar serviço:", error);
        }

        res.send(service);
    }

    static async create(req: Request, res: Response) {
        const { name, description, price, duration_minutes } = req.body;

        if (!name || !description || !price || !duration_minutes) {
            return res.status(400).send({
                message: "Nome, descrição, preço e a duração são obrigatórios!"
            });
        }

        const service = await Service.create({ name: name, description: description, price: price, duration_minutes: duration_minutes });
        await invalidateServicesCache();
        res.send(service);
    }

    static async remove(req: Request, res: Response) {
        const { id } = req.params;
        const service = await Service.findByPk(Number(id));

        if (!service) {
            return res.status(404).send({ message: "Serviço não encontrado!" });
        }

        await service.destroy();
        await invalidateServicesCache(Number(id));
        return res.status(204).send();
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const service = await Service.findByPk(Number(id));
        const { name, description, price, duration_minutes, active } = req.body;

        if (!service) {
            return res.status(404).send({ message: "Serviço não encontrado!" });
        }

        if (
            name === undefined &&
            description === undefined &&
            price === undefined &&
            duration_minutes === undefined &&
            active === undefined
        ) {
            return res.status(400).send({
                message: "Informe ao menos um campo para atualização!"
            });
        }

        await service.update({
            name: name ?? service.name,
            description: description ?? service.description,
            price: price ?? service.price,
            duration_minutes: duration_minutes ?? service.duration_minutes,
            active: active ?? service.active,
        });

        await invalidateServicesCache(Number(id));
        return res.send(service);
    }



}

export default ServicesController;