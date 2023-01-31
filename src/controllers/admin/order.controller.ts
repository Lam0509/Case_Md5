import {OrderDetail} from "../../entity/OrderDetail";
import {AppDataSource} from "../../data-source";
import {Order} from "../../entity/Order";
import {Shipper} from "../../entity/Shipper";

const orderRepository = AppDataSource.getRepository(Order);
const orderDetailRepository = AppDataSource.getRepository(OrderDetail);
const shipperRepository = AppDataSource.getRepository(Shipper);

class OrderController {
    // Bên user
    async add(req, res) {
        const orders = await orderRepository.find()
        const order = orders[orders.length-1]
        let data = req.body;
        let arr = [];
        let obj = {
            quantity: 0,
            order: {
                id: 0
            },
            product: {
                id: 0
            }
        }
        data.myCart.map(item => {
            obj = {...obj, quantity: item.quantity, order: {id: order.id+1}, product: {id: item.id}}
            arr.push(obj);
        })
        const shippers = await shipperRepository.findBy({status: false})
        let shipper = shippers[Math.floor(Math.random() * shippers.length)]
        await orderRepository.createQueryBuilder('order')
            .innerJoin('order.user', 'user')
            .innerJoin('order.shipper', 'shipper')
            .insert()
            .into(Order)
            .values({
                id: order.id+1,
                date: `2019-04-21`,
                user: {
                    id: data.userId
                },
                shipper: {
                    id: shipper.id
                }
            })
            .execute();

        await orderDetailRepository.createQueryBuilder('order_detail')
            .innerJoin('order_detail.product', 'product')
            .innerJoin('order_detail.order', 'order')
            .insert()
            .into(OrderDetail)
            .values(arr)
            .execute()

        await shipperRepository.createQueryBuilder('shipper')
            .update(Shipper)
            .set({ status: true})
            .where("id = :id", { id: shipper.id })
            .execute()

        res.json('success');
    }

    // Đã dùng
    async showOrderDetail(req, res) {
        const id = +req.params.id;
        const orderDetail = await orderDetailRepository.createQueryBuilder('order_detail')
            .innerJoin('order_detail.order', 'order')
            .innerJoin('order_detail.product', 'product')
            .select('product.name, product.image, product.price, order_detail.quantity')
            .where('order.id = :orderId', {orderId: id})
            .getRawMany()
        res.status(200).json(orderDetail);
    }

    // Đã dùng
    async search(req, res) {
        let date = req.query.date;
        let status = req.query.status;
        let user = req.query.user;
        let query = orderRepository.createQueryBuilder('order')
            .innerJoin('order.user', 'user')
            .innerJoin('order.shipper', 'shipper')
            .select('order.id, order.date, user.name, order.status')
            .addSelect('shipper.name', 's_name')
        if (date) {
            query.where('order.date = :date', {date: date})
        }
        if (status) {
            query.andWhere('order.status = :status', {status: status})
        }
        if (user && user !== '') {
            query.andWhere('user.name LIKE :name', {name: `%${user}%`})
        }
        const orders = await query.orderBy('order.id', 'ASC').getRawMany();
        res.status(200).json(orders)
    }

    // Lấy hết status // Đã dùng
    async getStatus(req, res) {
        const allStatus = await orderRepository.createQueryBuilder('order')
            .select('DISTINCT(order.status) as status')
            .execute();
        res.json(allStatus);
    }

    // Đã dùng
    async update(req, res) {

        if (req.body.status === 'Đã giao') {
            const result = await orderRepository.createQueryBuilder('order')
                .innerJoin('order.shipper', 'shipper')
                .select('shipper.id')
                .where('order.id = :id', {id: req.params.id})
                .getRawOne()
            await orderRepository.createQueryBuilder('order')
                .innerJoin('order.shipper', 'shipper')
                .update()
                .set({status: req.body.status})
                .where('id = :id', {id: req.params.id})
                .execute()

            await shipperRepository.createQueryBuilder('shipper')
                .update()
                .set({status: false})
                .where('id = :id', {id: result.shipper_id})
                .execute()

            res.json('success')
        } else {
            await orderRepository.createQueryBuilder('order')
                .update()
                .set({status: req.body.status})
                .where('id = :id', {id: req.params.id})
                .execute()
            res.json('success')
        }
    }

    // Đã dùng
    async delete(req, res) {
        let orderId = req.params.id

        await orderDetailRepository.createQueryBuilder('order_detail')
            .innerJoin('order_detail.order', 'order')
            .delete()
            .from(OrderDetail)
            .where("order.id = :id", { id: orderId })
            .execute()

        await orderRepository.createQueryBuilder('order')
            .delete()
            .from(Order)
            .where("id = :id", { id: orderId })
            .execute()

        res.json('success')
    }
}

const orderController = new OrderController();

export default orderController;

