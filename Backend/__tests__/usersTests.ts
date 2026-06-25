import { Request, Response } from "express";
import UsersController from "../src/controllers/usersController";
import User from "../src/models/User";
import Barber from "../src/models/Barber";
import Appointment from "../src/models/Appointment";
import bcrypt from "bcrypt";

jest.mock("../src/config/database", () => ({
    __esModule: true,
    default: {
        transaction: jest.fn(async (callback) => {
            return callback({});
        }),
    },
}));

jest.mock("../src/models/User", () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock("../src/models/Barber", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock("../src/models/Appointment", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock("../src/models/BarberSchedule", () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    __esModule: true,
    default: {
        hash: jest.fn(),
    },
}));

describe("UsersController", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            locals: {},
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("list", () => {
        it("deve retornar todos os usuários", async () => {
            const mockUsers = [
                { id: 1, name: "Ana", email: "ana@mail.com", admin: false },
                { id: 2, name: "Bruno", email: "bruno@mail.com", admin: true },
            ];

            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

            await UsersController.list(mockRequest as Request, mockResponse as Response);

            expect(User.findAll).toHaveBeenCalledTimes(1);
            expect(mockResponse.send).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe("getById", () => {
        it("deve retornar usuário quando encontrado", async () => {
            const mockUser = { id: 1, name: "Ana" };
            mockRequest.params = { id: "1" } as any;

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await UsersController.getById(mockRequest as Request, mockResponse as Response);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
        });

        it("deve retornar 404 quando usuário não existir", async () => {
            mockRequest.params = { id: "999" } as any;
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await UsersController.getById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith({ message: "Usuário não encontrado!" });
        });
    });

    describe("create", () => {
        it("deve criar usuário com email normalizado e senha hasheada", async () => {
            mockRequest.body = { name: "Ana", email: "  ANA@MAIL.COM  ", password: "Senha1!", cpf: "529.982.247-25" };

            const createdUser = { id: 10, name: "Ana", email: "ana@mail.com", password: "hashed-password", cpf: "52998224725", admin: 0 };

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
            (User.create as jest.Mock).mockResolvedValue(createdUser);

            await UsersController.create(mockRequest as Request, mockResponse as Response);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "ana@mail.com" } });
            expect(bcrypt.hash).toHaveBeenCalledWith("Senha1!", 10);
            expect(User.create).toHaveBeenCalledWith({ name: "Ana", email: "ana@mail.com", password: "hashed-password", cpf: "52998224725", admin: 0 });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.send).toHaveBeenCalledWith(createdUser);
        });

        it("deve retornar 400 quando já existir usuário com o email", async () => {
            mockRequest.body = { name: "Ana", email: "ana@mail.com", password: "Senha1!", cpf: "52998224725" };

            (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: "ana@mail.com" });

            await UsersController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Usuário já existe com esse Email" });
            expect(User.create).not.toHaveBeenCalled();
        });

        it("deve retornar 400 quando senha for fraca", async () => {
            mockRequest.body = { name: "Ana", email: "ana@mail.com", password: "abc123", cpf: "12345678901" };

            (User.findOne as jest.Mock).mockResolvedValue(null);

            await UsersController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({
                message: "A senha deve conter no mínimo 7 caracteres, uma letra maiúscula, um número e um caractere especial",
            });
            expect(User.create).not.toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("deve remover usuário existente", async () => {
            const mockUser = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(undefined),
            };

            mockRequest.params = { id: "1" } as any;

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            (Barber.findOne as jest.Mock).mockResolvedValue(null);
            (Appointment.findOne as jest.Mock).mockResolvedValue(null);

            await UsersController.remove(mockRequest as Request, mockResponse as Response);

            expect(User.findByPk).toHaveBeenCalledWith(1);

            expect(Barber.findOne).toHaveBeenCalledWith({
                where: { user_id: 1 },
                transaction: expect.any(Object),
            });

            expect(mockUser.destroy).toHaveBeenCalledWith({
                transaction: expect.any(Object),
            });

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalledWith();
        });

        it("deve retornar 404 ao remover usuário inexistente", async () => {
            mockRequest.params = { id: "999" } as any;
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await UsersController.remove(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith({ message: "Usuário não encontrado!" });
        });
    });

    describe("update", () => {
        it("deve atualizar campos enviados e manter os não enviados", async () => {
            const mockUser = { id: 1, name: "Ana", password: "old-hash", cpf: "12345678901", admin: false, update: jest.fn().mockResolvedValue(undefined) };
            const mockBarber = { phone: null, photo: null, active: true, update: jest.fn().mockResolvedValue(undefined) };

            mockRequest.params = { id: "1" } as any;
            mockRequest.body = { name: "Ana Maria", admin: true };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            (Barber.findOne as jest.Mock).mockResolvedValue(mockBarber);

            await UsersController.update(mockRequest as Request, mockResponse as Response);

            expect(mockUser.update).toHaveBeenCalledWith({ name: "Ana Maria", password: "old-hash", cpf: "12345678901", admin: true });
            expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
        });

        it("deve hashear nova senha quando a senha for enviada", async () => {
            const mockUser = {
                id: 1,
                name: "Ana",
                password: "old-hash",
                cpf: "12345678901",
                admin: false,
                update: jest.fn().mockResolvedValue(undefined),
            };

            mockRequest.params = { id: "1" } as any;
            mockRequest.body = { password: "NovaSenha1!" };

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            (Barber.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue("new-hash");

            await UsersController.update(mockRequest as Request, mockResponse as Response);

            expect(bcrypt.hash).toHaveBeenCalledWith("NovaSenha1!", 10);
            expect(mockUser.update).toHaveBeenCalledWith({
                name: "Ana",
                password: "new-hash",
                cpf: "12345678901",
                admin: false,
            });
        });

        it("deve retornar 400 quando nenhum campo for enviado", async () => {
            const mockUser = { id: 1, name: "Ana", password: "old-hash", cpf: "12345678901", admin: false, update: jest.fn() };

            mockRequest.params = { id: "1" } as any;
            mockRequest.body = {};

            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await UsersController.update(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith({ message: "Informe ao menos um campo para atualização!" });
            expect(mockUser.update).not.toHaveBeenCalled();
        });

        it("deve retornar 404 ao atualizar usuário inexistente", async () => {
            mockRequest.params = { id: "999" } as any;
            mockRequest.body = { name: "Novo Nome" };

            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await UsersController.update(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith({ message: "Usuário não encontrado!" });
        });
    });
});