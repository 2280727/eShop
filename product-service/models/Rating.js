import sequelize from "../connections/db.js";
import { DataTypes, Sequelize, UUID } from "sequelize";
import Product from "./Product.js";

const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        dialectTypes: 0,
    }
},{
    timestamps: false,
    tableName: 'Rating',
    freezeTableName: true // Prevent Sequelize from pluralizing
})


Product.hasOne(Rating, { foreignKey: 'productUuid', as: 'rating', onDelete: 'CASCADE' });
Rating.belongsTo(Product, { foreignKey: 'productUuid' });

export default Rating;