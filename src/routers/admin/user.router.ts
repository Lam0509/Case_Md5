import {Router} from "express";
import userController from "../../controllers/admin/user.controller";

const router = Router();

router.get('/', userController.showList);

router.post('/add', userController.add);

router.post('/update/:id', userController.update);

router.get('/detail/:id', userController.showUserDetail);

export default router;