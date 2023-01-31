import {User} from "../../entity/User";
import {AppDataSource} from "../../data-source";
import jwt from "jsonwebtoken";
import {Order} from "../../entity/Order";

const userRepository = AppDataSource.getRepository(User);
const orderRepository = AppDataSource.getRepository(Order);

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

    // Đã dùng
    async showUserDetail(req, res) {
        let tokenUser = req.query.token;
        console.log(tokenUser)
        jwt.verify(tokenUser.toString(), "123456789", async (err, decoded) => {
            if (err) {
                res.status(401).json({ message: err.message });
            } else {
                let userId = decoded.user_id;
                const userInfo = await userRepository.find({
                    relations: {
                        orders: {
                            shipper: true,
                            orderDetails: {
                                product: true
                            }
                        }
                    },
                    where: {
                        id: userId
                    }
                })
                res.json(userInfo)
            }
        });
    }
}

const userController = new UserController();

export default userController

