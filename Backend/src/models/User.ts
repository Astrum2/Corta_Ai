import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Barber from "./Barber";
import Role from "./Roles";

class User extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare cpf: string;
    declare role_id: number;
    declare created_at: Date;
    declare role?: Role;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: false,
    }
);

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
});

Role.hasMany(User, {
    foreignKey: "role_id",
    as: "users",
});

User.hasOne(Barber, {
    foreignKey: "user_id",
    as: "barber",
});

Barber.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});

export default User;