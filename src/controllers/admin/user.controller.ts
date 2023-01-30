import {User} from "../../entity/User";
import {AppDataSource} from "../../data-source";

const userRepository = AppDataSource.getRepository(User);

class UserController {
    async showList(req, res) {
        const users = await userRepository.find();
        res.status(200).json(users)
    }


    // Bên user thêm sau khi đăng ký
    async add(req, res) {
        await userRepository.save({...req.body, image: req.files.image.name})
        res.status(200).json({
            message: 'Add successfully!!!'
        })
    }

    async update(req, res) {
        const userId = req.params.id;
        await userRepository.createQueryBuilder()
            .update()
            .set({...req.body, image: req.files.image.name})
            .where("id = :id", {id: userId})
            .execute()

        res.status(200).json({
            message: 'Update successfully!!!'
        })
    }

    async showUserDetail(req, res) {
        const userId = req.params.id;
        const user = await userRepository.findOneBy({id: userId});
        res.status(200).json(user)
    }
}

const userController = new UserController();

export default userController