import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Service extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare price: number;
    declare duration_minutes: number;
    declare active: boolean;
}

Service.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false
        },
        duration_minutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: "services",
        timestamps: false,
    },
)

export default Service;