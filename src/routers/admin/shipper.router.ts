import { Router } from 'express';
import shipperController from "../../controllers/admin/shipper.controller";

const router = Router();

router.get('/', shipperController.showList);

router.post('/add', shipperController.add);

router.get('/search', shipperController.search);

export default router