import {AppDataSource} from "../../data-source";
import {Category} from "../../entity/Category";

const categoryRepository = AppDataSource.getRepository(Category);

class CategoryController {
    async showList(req, res) {
        const categories = await categoryRepository.find();
        res.status(200).json(categories)
    }

    async add(req, res) {
        await categoryRepository.save({...req.body})
        res.status(200).json({
            message: 'Add successfully!!!'
        })
    }

    async update(req, res) {
        let idSelected = req.params.id;
        await categoryRepository.createQueryBuilder()
            .update()
            .set({...req.body})
            .where("id = :id", {id: idSelected})
            .execute()

        res.status(200).json({
            message: 'Update successfully!!!'
        })
    }
}

const categoryController = new CategoryController();

export default categoryController