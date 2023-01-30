import { Router } from 'express';
import productController from "../../controllers/admin/product.controller";

const router = Router();

router.post('/add', productController.add);

router.get('/hide', productController.hide);

router.post('/update/:id', productController.update);

router.get('/search', productController.search)

router.get('/status', productController.getAllStatus)

router.get('/detail/:id', productController.showProductDetail);

export default router