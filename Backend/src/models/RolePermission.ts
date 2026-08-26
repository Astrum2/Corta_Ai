import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class RolePermission extends Model {}

RolePermission.init(
    {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "roles",
                key: "id",
            },
        },

        permission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "permissions",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "role_permissions",
        timestamps: false,
    }
);

export default RolePermission;