import {AppDataSource} from "../../data-source";
import {Assessment} from "../../entity/Assessment";

const assessmentRepository = AppDataSource.getRepository(Assessment);

class AssessmentController {

    // Bên giao diện user
    async showAssessmentOfProduct(req, res) {
        let idSelected = req.params.id;
        const assessments = await assessmentRepository.createQueryBuilder('assessment')
            .innerJoin('assessment.user', 'user')
            .innerJoin('assessment.product', 'product')
            .select('user.name, user.image, assessment.point, assessment.comment')
            .addSelect('assessment.image', 'assessment_image')
            .where('product.id = :id', {id: idSelected})
            .getRawMany()

        res.status(200).json(assessments)
    }

    // Bên user
    async add(req, res) {

    }

    // Bên user
    async delete(req, res) {
        let assessmentId = req.params.id
        await assessmentRepository.createQueryBuilder('assessment')
            .delete()
            .where('assessment.id = :id', {id: assessmentId})
            .execute()

        res.status(200).json({
            message: 'Delete successfully!!!'
        })
    }

    // Bên user
    async update(req, res) {

    }

    // Bên admin
    async search(req, res) {
        let product = req.query.product;
        let point = req.query.point;
        let query = assessmentRepository.createQueryBuilder('assessment')
            .innerJoin('assessment.product', 'product')
        if (product && product !== '') {
            query.where('product.name LIKE :name', {name: `%${product}%`})
        }
        if (point) {
            query.andWhere('assessment.point = :point', {point: point})
        }
        const assessments = await query.getRawMany();
        res.status(200).json(assessments)
    }
}

const assessmentController = new AssessmentController();

export default assessmentController