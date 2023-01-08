import {AppDataSource} from "../../data-source";
import {Product} from "../../entity/Product";
const productRepository = AppDataSource.getRepository(Product)

class ProductController {
    async showList(req, res) {
        const products = await productRepository.find();
        res.status(200).json(products)
    }

    async add(req, res) {
        // Example
        let ids = [1, 2, 3]
        let product = new Product();
        product = {...req.body, image: req.files.image.name}
        await productRepository.save(product);
        await productRepository.createQueryBuilder()
            .relation(Product, "categories")
            .of(product.id)
            .add(ids)
        res.status(200).json({
            message: 'Add successfully!!!'
        })
    }

    async hide(req, res) {
        // Example
        const ids = [10];
        await productRepository.createQueryBuilder()
            .update()
            .set({status: false})
            .where("id IN(:...ids)", {ids: ids})
            .execute()

        res.status(200).json({
            message: 'Hide successfully!!!'
        })
    }

    async update(req, res) {
        let idSelected = req.params.id;
        // Example
        let categoriesSelected = [3, 4]

        const categories = await productRepository.createQueryBuilder()
            .relation(Product, "categories")
            .of(idSelected)
            .loadMany()

        await productRepository.createQueryBuilder()
            .update()
            .set({...req.body, image: req.files.image.name})
            .where("id = :id", {id: idSelected})
            .execute()

        await productRepository.createQueryBuilder()
            .relation(Product, "categories")
            .of(idSelected)
            .addAndRemove(categoriesSelected, categories)

        res.status(200).json({
            message: 'Update successfully!!!'
        })
    }

    async showProductDetail(req, res) {
        let id = req.params.id;

        const product = await productRepository.findOneBy({id: id})
        const categories = await productRepository.createQueryBuilder()
            .relation(Product, "categories")
            .of(id)
            .loadMany()

        res.status(200).json({
            product: product,
            categories: categories
        });
    }

    async search(req, res) {
        let keyword = req.query.keyword;
        let categoryId = req.query.categoryId;
        let status = req.query.status;
        let query = productRepository.createQueryBuilder('product')
            .innerJoin('product.categories', 'category')
        if (keyword && keyword !== '') {
            query.where('product.name LIKE :name', {name: `%${keyword}%`})
        }
        if (categoryId) {
            query.andWhere('category.id = :id', {id: categoryId})
        }
        if (status) {
            query.andWhere('product.status = :status', {status: status})
        }
        const products = await query.groupBy('product.id').getRawMany();
        res.status(200).json(products)
    }

}

const productController = new ProductController();

export default productController;

