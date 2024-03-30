import Sequelize from "sequelize";

const {
    POSTGRES_HOST: HOST,
    POSTGRES_USER: USER,
    POSTGRES_PASSWORD: PASSWORD,
    POSTGRES_DB: DB,
    POSTGRES_PORT: DB_PORT
} = process.env;



//export const sequelize = new Sequelize (DB,USER, PASSWORD, { 
export const sequelize = new Sequelize (DB,USER, PASSWORD, { // TODO: Check why env variable does not work
    host: HOST,
    dialect:'postgres',
    port: DB_PORT,
    logging: false,
});



