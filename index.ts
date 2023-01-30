import express from "express";
import {AppDataSource} from "./src/data-source";
import adminProductRouter from "./src/routers/admin/product.router"
import adminOrderRouter from "./src/routers/admin/order.router"
import adminCategoryRouter from "./src/routers/admin/category.router"
import adminShipperRouter from "./src/routers/admin/shipper.router"
import adminAssessmentRouter from "./src/routers/admin/assessment.router"
import adminUserRouter from "./src/routers/admin/user.router"
import adminDashboardRouter from "./src/routers/admin/dashboard.router"
import adminAuthRouter from "./src/routers/auth.router"
const PORT = 8000;
import fileUpload from "express-fileupload";
import {OrderDetail} from "./src/entity/OrderDetail";
import {Order} from "./src/entity/Order";
import {Assessment} from "./src/entity/Assessment";

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
app.use('/', adminAuthRouter)
app.use('/admin/product', adminProductRouter)
app.use('/admin/order', adminOrderRouter)
app.use('/admin/category', adminCategoryRouter)
app.use('/admin/shipper', adminShipperRouter);
app.use('/admin/assessment', adminAssessmentRouter);
app.use('/admin/user', adminUserRouter);
app.use('/admin/dashboard', adminDashboardRouter);

// Dashboard

// Revenue

app.get('/admin/reports/revenue/year', async (req, res) => {
    // Example
    let year = 2022
    const current = await orderDetailRepository.createQueryBuilder('order_detail')
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

    const past = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year-1}%`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num)
        })

    if (current > past) {
        let change = +(((current-past)/past)*100).toFixed(2)
        res.json({
            current: current,
            change: change,
            sub: 'last year'
        })
    }
    if (current < past) {
        let change = (+(((current-past)/past)*100).toFixed(2));
        res.json({
            current: current,
            change: change,
            sub: 'last year'
        })
    }
    if (current === past) {
        res.json({
            current: current,
            change: 0,
            sub: 'last year'
        })
    }
})

app.get('/admin/reports/revenue/month', async (req, res) => {
    // Example
    let year = 2022
    // let currentMonth = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let currentMonth = '02';
    let pastMonth = '01'
    // let pastMonth = new Date().getMonth() < 10 ? `0${new Date().getMonth()}` : new Date().getMonth()
    const current = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}-${currentMonth}%`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num, 0)
        })

    const past = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}-${pastMonth}%`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num, 0)
        })

    if (current > past) {
        let change = +(((current-past)/past)*100).toFixed(2)
        res.json({
            current: current,
            change: change,
            sub: 'last month'
        })
    }
    if (current < past) {
        let change = Math.abs(+(((current-past)/past)*100).toFixed(2));
        res.json({
            current: current,
            change: change,
            sub: 'last month'
        })
    }
    if (current === past) {
        res.json({
            current: current,
            change: 0,
            sub: 'last month'
        })
    }
})

app.get('/admin/reports/revenue/date', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let currentDate = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    let yesterday = new Date().getDate()-1 < 10 ? `0${new Date().getDate()-1}` : new Date().getDate()-1
    const current = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}-${month}-${currentDate}`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num)
        })

    const past = await orderDetailRepository.createQueryBuilder('order_detail')
        .innerJoin('order_detail.order', 'order')
        .innerJoin('order_detail.product', 'product')
        .select('order.id, order.date')
        .addSelect('SUM(order_detail.quantity * product.price)', 'sum')
        .groupBy('order.id')
        .where('order.date LIKE :date', {date: `${year}-${month}-${yesterday}`})
        .getRawMany()
        .then(items => {
            return items.map(item => parseInt(item.sum)).reduce((total, num) => total + num)
        })

    if (current > past) {
        let change = +(((current-past)/past)*100).toFixed(2)
        res.json({
            current: current,
            change: change,
            sub: 'yesterday'
        })
    }
    if (current < past) {
        let change = Math.abs(+(((current-past)/past)*100).toFixed(2));
        res.json({
            current: current,
            change: change,
            sub: 'yesterday'
        })
    }
    if (current === past) {
        res.json({
            current: current,
            change: 0,
            sub: 'yesterday'
        })
    }
})

// Orders

app.get('/admin/reports/orders/year', async (req, res) => {
    // Example
    let year = 2022
    const current = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}%`})
        .getRawOne()

    const past = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year-1}%`})
        .getRawOne()

    if (+current.total > +past.total) {
        let change = +(((+current.total-+past.total)/+past.total)*100).toFixed(2)
        res.json({
            current: +current.total,
            change: change,
            sub: 'last year'
        })
    }
    if (+current.total < +past.total) {
        let change = (+(((+current.total-+past.total)/+past.total)*100).toFixed(2));
        res.json({
            current: +current.total,
            change: change,
            sub: 'last year'
        })
    }
    if (+current.total === +past.total) {
        res.json({
            current: +current.total,
            change: 0,
            sub: 'last year'
        })
    }
})

app.get('/admin/reports/orders/month', async (req, res) => {
    // Example
    let year = 2022
    let currentMonth = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let pastMonth = new Date().getMonth() < 10 ? `0${new Date().getMonth()}` : new Date().getMonth()
    const current = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}-${currentMonth}%`})
        .getRawOne()

    const past = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}-${pastMonth}%`})
        .getRawOne()

    if (+current.total > +past.total) {
        let change = +(((+current.total-+past.total)/+past.total)*100).toFixed(2)
        res.json({
            current: +current.total,
            change: change,
            sub: 'last month'
        })
    }
    if (+current.total < +past.total) {
        let change = Math.abs(+(((+current.total-+past.total)/+past.total)*100).toFixed(2));
        res.json({
            current: +current.total,
            change: change,
            sub: 'last month'
        })
    }
    if (+current.total === +past.total) {
        res.json({
            current: +current.total,
            change: 0,
            sub: 'last month'
        })
    }
})

app.get('/admin/reports/orders/date', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let currentDate = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    let yesterday = new Date().getDate()-1 < 10 ? `0${new Date().getDate()-1}` : new Date().getDate()-1
    const current = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}-${month}-${currentDate}`})
        .getRawOne()

    const past = await orderRepository.createQueryBuilder('order')
        .select('COUNT(order.id)', 'total')
        .where('order.date LIKE :date', {date: `${year}-${month}-${yesterday}`})
        .getRawOne()

    if (+current.total > +past.total) {
        let change = +(((+current.total-+past.total)/+past.total)*100).toFixed(2)
        res.json({
            current: +current.total,
            change: change,
            sub: 'yesterday'
        })
    }
    if (+current.total < +past.total) {
        let change = Math.abs(+(((+current.total-+past.total)/+past.total)*100).toFixed(2));
        res.json({
            current: +current.total,
            change: change,
            sub: 'yesterday'
        })
    }
    if (+current.total === +past.total) {
        res.json({
            current: +current.total,
            change: 0,
            sub: 'yesterday'
        })
    }
})

// Users

app.get('/admin/reports/users/year', async (req, res) => {
    // Example
    let year = 2022
    const current = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('DISTINCT(user.id)')
        .where('order.date LIKE :date', {date: `${year}%`})
        .execute()

    const past = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('DISTINCT(user.id)')
        .where('order.date LIKE :date', {date: `${year-1}%`})
        .execute()

    if (current.length > past.length) {
        let change = +(((current.length-past.length)/past.length)*100).toFixed(2)
        res.json({
            current: current.length,
            change: change,
            sub: 'last year'
        })
    }
    if (current.length < past.length) {
        let change = (+(((current.length-past.length)/past.length)*100).toFixed(2));
        res.json({
            current: current.length,
            change: change,
            sub: 'last year'
        })
    }
    if (current.length === past.length) {
        res.json({
            current: current.length,
            change: 0,
            sub: 'last year'
        })
    }
})

app.get('/admin/reports/users/month', async (req, res) => {
    // Example
    let year = 2022
    let currentMonth = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let pastMonth = new Date().getMonth() < 10 ? `0${new Date().getMonth()}` : new Date().getMonth()
    const current = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('DISTINCT(user.id)')
        .where('order.date LIKE :date', {date: `${year}-${currentMonth}%`})
        .execute()

    const past = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('DISTINCT(user.id)')
        .where('order.date LIKE :date', {date: `${year}-${pastMonth}%`})
        .execute()

    if (current.length > past.length) {
        let change = +(((current.length-past.length)/past.length)*100).toFixed(2)
        res.json({
            current: current.length,
            change: change,
            sub: 'last month'
        })
    }
    if (current.length < past.length) {
        let change = Math.abs(+(((current.length-past.length)/past.length)*100).toFixed(2));
        res.json({
            current: current.length,
            change: change,
            sub: 'last month'
        })
    }
    if (current.length === past.length) {
        res.json({
            current: current.length,
            change: 0,
            sub: 'last month'
        })
    }
})

app.get('/admin/reports/users/date', async (req, res) => {
    // Example
    let year = 2022
    let month = new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1
    let currentDate = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
    let yesterday = new Date().getDate()-1 < 10 ? `0${new Date().getDate()-1}` : new Date().getDate()-1
    const current = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('DISTINCT(user.id)')
        .where('order.date LIKE :date', {date: `${year}-${month}-${currentDate}`})
        .execute()

    const past = await orderRepository.createQueryBuilder('order')
        .innerJoin('order.user', 'user')
        .select('DISTINCT(user.id)')
        .where('order.date LIKE :date', {date: `${year}-${month}-${yesterday}`})
        .execute()

    if (current.length > past.length) {
        let change = +(((current.length-past.length)/past.length)*100).toFixed(2)
        res.json({
            current: current.length,
            change: change,
            sub: 'yesterday'
        })
    }
    if (current.length < past.length) {
        let change = Math.abs(+(((current.length-past.length)/past.length)*100).toFixed(2));
        res.json({
            current: current.length,
            change: change,
            sub: 'yesterday'
        })
    }
    if (current.length === past.length) {
        res.json({
            current: current.length,
            change: 0,
            sub: 'yesterday'
        })
    }
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

// Get all years
app.get('/admin/reports/years', async (req, res) => {
    const result = await orderRepository.createQueryBuilder('order')
        .select('DISTINCT(EXTRACT(YEAR FROM order.date)) AS date')
        .orderBy('date', 'ASC')
        .execute()

    res.json(result)
})

app.listen(PORT, () => {
    console.log("App running with port: " + PORT)
})






