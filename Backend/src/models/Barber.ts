import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Barber extends Model {
    declare id: number;
    declare user_id: number;
    declare name: string;
    declare photo: string | null;
    declare phone: string | null;
    declare active: boolean;
    declare created_at: Date;
}

Barber.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "barbers",
        timestamps: false,
    }
);

export default Barber;