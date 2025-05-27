import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('process.env.DB_NAME', process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'sql5781355',
  process.env.DB_USER || 'sql5781355',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // Cambiar a true para ver las consultas SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;