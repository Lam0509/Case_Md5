import {AppDataSource} from "../../data-source";
import {Product} from "../../entity/Product";
const productRepository = AppDataSource.getRepository(Product)

class ProductController {
    async showList(req, res) {
        const products = await productRepository.find();
        res.status(200).json(products)
    }

    async add(req, res) {
        let ids = req.body.category.map(id => parseInt(id))
        req.body.status = (req.body.status.length !== 0) ? 1 : 0
        let product = new Product();
        product = {...req.body, image: req.body.image.split('\\')[2]}
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
        const ids = req.query.ids;
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

        req.body.status = true ? 1 : 0

        let product = {
            name: req.body.name,
            image: req.body.image.split('\\')[2],
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status
        }

        // Example

        const categories = await productRepository.createQueryBuilder()
            .relation(Product, "categories")
            .of(idSelected)
            .loadMany()

        await productRepository.createQueryBuilder()
            .update()
            .set(product)
            .where("id = :id", {id: idSelected})
            .execute()

        await productRepository.createQueryBuilder()
            .relation(Product, "categories")
            .of(idSelected)
            .addAndRemove(req.body.category, categories)

        res.status(200).json({
            message: 'Update successfully!!!'
        })
    }

    async showProductDetail(req, res) {
        let id = req.params.id;

        const product = await productRepository.find({
            relations: {
                categories: true
            },
            where: {
            id: id}
            }
        )

        res.status(200).json({
            productSelected: product
        });
    }

    async search(req, res) {
        console.log(req.query.product)
        console.log(req.query.categories)
        console.log(req.query.status)
        let product = req.query.product;
        let categoryNames = req.query.categories;
        let status = req.query.status;
        let query = productRepository.createQueryBuilder('product')
            .leftJoin('product.categories', 'categories')
        if (categoryNames && categoryNames.length !== 0) {
            query = query.addSelect('COUNT(categoryId)', 'sum')
            categoryNames.forEach((categoryName, index) => {
                query = query.orWhere(`categories.name = "${categoryName}"`)
            })
            query = query.groupBy('productId')
            query = query.having('sum = :number', {number: categoryNames.length})
        }
        if (product && product !== '') {
            query = query.andWhere('product.name LIKE :key', {key: `%${product}%`})
        }
        if (status) {
            query = query.andWhere('product.status = :status', {status: status})
        }
        const products = await query.getMany()
        console.log(products)
        res.json(products)
    }

    async getAllStatus(req, res) {
        const allStatus = await productRepository.createQueryBuilder('product')
            .select('DISTINCT(product.status) as status')
            .execute()
        res.json(allStatus)
    }
}

const productController = new ProductController();

export default productController;


