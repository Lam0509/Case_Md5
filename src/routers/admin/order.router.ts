import { Router } from 'express';
import orderController from "../../controllers/admin/order.controller";

const router = Router();

router.get('/', orderController.showList);

router.post('/add', orderController.add);

router.get('/detail/:id', orderController.showOrderDetail);

router.get('/search', orderController.search);

export default router;