import express from "express";
import {AppDataSource} from "./src/data-source";
import adminProductRouter from "./src/routers/admin/product.router"
import adminOrderRouter from "./src/routers/admin/order.router"
import adminCategoryRouter from "./src/routers/admin/category.router"
import adminShipperRouter from "./src/routers/admin/shipper.router"
import adminAssessmentRouter from "./src/routers/admin/assessment.router"
import adminUserRouter from "./src/routers/admin/user.router"
const PORT = 8000;
import fileUpload from "express-fileupload";
import {OrderDetail} from "./src/entity/OrderDetail";
import {Order} from "./src/entity/Order";

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

// Example
const orderDetailRepository = AppDataSource.getRepository(OrderDetail)
const orderRepository = AppDataSource.getRepository(Order)

app.use(cors());
app.use(fileUpload({
    createParentPath: true
}))
app.use(express.json());
app.use('/admin/product', adminProductRouter)
app.use('/admin/order', adminOrderRouter)
app.use('/admin/category', adminCategoryRouter)
app.use('/admin/shipper', adminShipperRouter);
app.use('/admin/assessment', adminAssessmentRouter);
app.use('/admin/user', adminUserRouter)

// Dashboard

// Revenue

app.get('/admin/reports/revenue/year', async (req, res) => {
    // Example
    let year = 2022
    const total = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}%`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num)
        })

    res.json(total)
})

app.get('/admin/reports/revenue/month', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    const total = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}-${month}%`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num)
        })

    res.json(total)
})

app.get('/admin/reports/revenue/date', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let date = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    const total = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}-${month}-${date}`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num)
        })

    res.json(total)
})

// Orders

app.get('/admin/reports/orders/year', async (req, res) => {
    // Example
    let year = 2022
    const total = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}%`})
        .getRawOne()

    res.json(total.total)
})

app.get('/admin/reports/orders/month', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    const total = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}-${month}%`})
        .getRawOne()

    res.json(total.total)
})

app.get('/admin/reports/orders/date', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let date = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    const total = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}-${month}-${date}`})
        .getRawOne()

    res.json(total.total)
})

// Users

app.get('/admin/reports/users/year', async (req, res) => {
    // Example
    let year = 2022
    const total = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .where('order.date LIKE :date', {date: `${year}%`})
        .groupBy('user.id')
        .execute()

    res.json(total.length)
})

app.get('/admin/reports/users/month', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    const total = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .where('order.date LIKE :date', {date: `${year}-${month}%`})
        .groupBy('user.id')
        .execute()

    res.json(total.length)
})

app.get('/admin/reports/users/date', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let date = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    const total = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .where('order.date LIKE :date', {date: `${year}-${month}-${date}`})
        .groupBy('user.id')
        .execute()

    res.json(total.length)
})

// Chart

app.get('/admin/reports/chart', async (req, res) => {
    let year = req.query.year;
    const revenues = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('SUM(order_detail.quantity * product.price)', 'sum')
        .addSelect('MONTH(order.date)', 'month')
        .groupBy('month')
        .where('order.date LIKE :date', {date: `${year}%`})
        .orderBy('month')
        .execute()

    const orders = await orderRepository.createQueryBuilder('order')
        .select('MONTH(order.date)', 'month')
        .addSelect('COUNT(order.id)', 'total')
        .groupBy('month')
        .where('order.date LIKE :date', {date: `${year}%`})
        .orderBy('month')
        .execute()

    const users = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('MONTH(order.date)', 'month')
        .addSelect('COUNT(DISTINCT(user.id))', 'total')
        .groupBy('month')
        .where('order.date LIKE :date', {date: `${year}%`})
        .orderBy('month')
        .execute()

    res.status(200).json({
        revenues: revenues,
        orders: orders,
        users: users
    })

})

app.listen(PORT, () => {
    console.log("App running with port: " + PORT)
})






