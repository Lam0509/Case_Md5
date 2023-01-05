import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "lam050901",
    database: "shoppe_food",
    synchronize: false,
    logging: false,
    entities: ["dist/src/entity/*.js"],
    migrations: ["dist/src/migrations/*.js"],
})