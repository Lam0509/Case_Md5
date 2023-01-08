import {AppDataSource} from "../../data-source";
import {Shipper} from "../../entity/Shipper";

const shipperRepository = AppDataSource.getRepository(Shipper);

class ShipperController {
    async showList(req, res) {
        const shippers = await shipperRepository.find();
        res.status(200).json(shippers)
    }

    async add(req, res) {
        await shipperRepository.save({...req.body, image: req.files.image.name});
        res.status(200).json({
            message: 'Add successfully!!!'
        })
    }

    async search(req, res) {
        let status = req.query.status;
        let query = shipperRepository.createQueryBuilder('shipper')
        if (status && status !== '') {
            query.where('shipper.status = :status', {status: status})
        }
        const shippers = await query.getMany();
        res.status(200).json(shippers)
    }
}

const shipperController = new ShipperController();

export default shipperController