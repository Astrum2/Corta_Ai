import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Permission extends Model {
    declare id: number;
    declare name: string;
}

Permission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: "permissions",
        timestamps: false,
    }
);

export default Permission;