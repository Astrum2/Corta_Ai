import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Permission from "./Permission";
import RolePermission from "./RolePermission";

class Role extends Model {
    declare id: number;
    declare name: string;
}

Role.init(
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
        tableName: "roles",
        timestamps: false,
    }
);

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "role_id",
    otherKey: "permission_id",
    as: "permissions",
});

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permission_id",
    otherKey: "role_id",
    as: "roles",
});

export default Role;