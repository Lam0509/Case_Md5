import {Router} from "express";
import assessmentController from "../../controllers/admin/assessment.controller";

const router = Router();

router.get('/:id', assessmentController.showAssessmentOfProduct)

router.post('/add', assessmentController.add);

router.get('/delete/:id', assessmentController.delete)

router.get('/search', assessmentController.search)

export default router;