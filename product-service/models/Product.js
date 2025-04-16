import sequelize from "../db.js";
import { DataTypes, Sequelize } from "sequelize";
import { productCategories } from "../data/product.js";



const Product = sequelize.define('Product', {
    uuid : {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM(productCategories),
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            // Ensure price is a positive number
            isPositive(value) {
                if (value <= 0) {
                    throw new Error('Price must be greater than zero');
                }
            },
            // Optionally, you can enforce precision (e.g., 2 decimal places)
            isDecimal(value) {
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error('Price must be a valid number with up to 2 decimal places');
                }
            }
        }
    }
    
},{
    timestamps: false,
})


export default Product;