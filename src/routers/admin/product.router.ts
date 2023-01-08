import { Router } from 'express';
import productController from "../../controllers/admin/product.controller";

const router = Router();

router.get('/', productController.showList)

router.post('/add', productController.add);

router.get('/hide', productController.hide);

router.post('/update/:id', productController.update);

router.get('/detail/:id', productController.showProductDetail);

router.get('/search', productController.search)

export default router