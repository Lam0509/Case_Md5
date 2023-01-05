import {AppDataSource} from "../../data-source";
import {Product} from "../../entity/Product";
const productRepository = AppDataSource.getRepository(Product)

class ProductController {
    async showList(req, res) {
        const products = await productRepository.find();
        res.status(200).json(products)
    }


}

const productController = new ProductController();

export default productController;