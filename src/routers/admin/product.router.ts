import { Router } from 'express';
import {AppDataSource} from "../../data-source";
import {OrderDetail} from "../../entity/OrderDetail";
import productController from "../../controllers/admin/product.controller";

const router = Router();

router.get('/', productController.showList)

export default router