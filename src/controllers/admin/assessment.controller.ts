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
            .select('assessment.id, user.image, assessment.point, assessment.comment')
            .addSelect('user.name', 'u_name')
            .addSelect('product.name', 'p_name')
            .where('product.id = :id', {id: idSelected})
            .getRawMany()

        res.status(200).json(assessments)
    }

    // Bên user
    async add(req, res) {
        await assessmentRepository.createQueryBuilder('assessment')

        res.json({
            message: 'Add successfully!!!'
        })
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
        let key = req.query.product;
        let point = req.query.status[0];
        let query = assessmentRepository.createQueryBuilder('assessment')
            .innerJoin('assessment.user', 'user')
            .innerJoin('assessment.product', 'product')
            .select('assessment.id, assessment.point')
            .addSelect('user.name', 'u_name')
            .addSelect('product.name', 'p_name')
        if (key && key !== '') {
            query.where('product.name LIKE :name', {name: `%${key}%`})
        }
        if (point) {
            query.andWhere('assessment.point = :point', {point: point})
        }
        const assessments = await query.orderBy('assessment.id', 'ASC').getRawMany();
        res.status(200).json(assessments)
    }
}

const assessmentController = new AssessmentController();

export default assessmentController