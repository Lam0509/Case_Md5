import { Router } from 'express';
import categoryController from "../../controllers/admin/category.controller";

const router = Router();

router.get('/', categoryController.showList);

router.post('/add', categoryController.add);

router.post('/update/:id', categoryController.update)

export default router