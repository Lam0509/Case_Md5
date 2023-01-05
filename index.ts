import express from "express";
import {AppDataSource} from "./src/data-source";
import adminProductRouter from "./src/routers/admin/product.router"
const PORT = 8000;

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app = express();
const cors = require('cors');
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.json());
app.use(express.static('./src/public'));

app.use('/admin/product', adminProductRouter)

app.listen(PORT, () => {
    console.log("App running with port: " + PORT)
})





