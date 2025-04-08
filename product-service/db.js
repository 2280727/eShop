import { Sequelize } from "sequelize";
import dotenv from 'dotenv';


dotenv.config();

const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PASSWORD, {
    host: '135.181.150.234',
    dialect: 'postgres',
    port: 5432,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");
      } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
      }
}

connectDB();

export default sequelize;