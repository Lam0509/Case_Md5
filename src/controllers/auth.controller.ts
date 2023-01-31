import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from '../entity/User';
import {AppDataSource} from "../data-source";

class AuthController {
    showFormRegister(req, res, next) {
        res.status(200).json({title: 'This is register form'});
    }

    async register(req: any, res, next) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            let {name, age, gender, image, address, phone, email, password} = req.body;
            let user = await userRepository.findOneBy({email: email});
            if (!user) {
                const passwordHash = await bcrypt.hash(password, 10);
                let userData = {
                    name: name,
                    age: age,
                    gender: gender,
                    image: image,
                    address: address,
                    phone: phone,
                    email: email,
                    password: passwordHash
                }
                let newUser = await userRepository.save(userData);
                console.log(newUser);
                res.json({user: newUser, code: 200})
            } else {
                res.json({err: "User exited"});
            }
        } catch (err) {
            res.json({err: err})
        }
    }

    showFormLogin(req, res, next) {
        res.status(200).json({title: 'This is login form'});
    }

    async login(req, res, next) {
        try {
            console.log(2)
            const userRepository = AppDataSource.getRepository(User);
            let {email, password} = req.body;
            console.log(req.body)
            if (!email || !password) {
                return res.status(400).json({title: 'Email and password are required'});
            }
            let user = await userRepository.findOneBy({email: email});
            if (!user) {
                return res.status(400).json({title: 'User not found'});
            }
            console.log(user)
            let result = await bcrypt.compare(password, user.password);
            if (result) {
                let payload = {
                    user_id: user["id"],
                    user_email: user["email"],
                    user_role: user["role"]
                }
                console.log(payload)
                const token = jwt.sign(payload, '123456789', {
                    expiresIn: 60 * 60 * 24
                });

                if (user.role == 'admin') {
                    return res.status(200).json({
                        title: 'This is admin page',
                        token
                    });
                } else {
                    return res.status(200).json({
                        title: 'This is user page',
                        token
                    });
                }
            }

        } catch (err) {
            res.status(400).json({err: err})
        }
    }
    async updatePassword(req,res){
        try {
            const userRepository = AppDataSource.getRepository(User);
            const{oldPassword,newPassword} = req.body;
            const user = await userRepository.findOneBy({id:req.user.id});
            const passwordCompare = await bcrypt.compare(oldPassword, user.password);
            if(!passwordCompare){
                res.status(400).json({title:'Password is invalid'});
            }
            let passwordHashUpdated = await bcrypt.hash(newPassword,10);
            let userNewPassword = {
                password: passwordHashUpdated
            }
            let newUser = await userRepository.save(userNewPassword);
            res.json({user: newUser, code: 200})
        }catch (err) {
            res.status(400).json({err: err})
        }
    }
    async logout(req, res) {
        try {
            res.clear('token');
            res.json({title: 'logout successfully'});
        } catch (err) {
            res.status(400).json({err: err})
        }
    }

}

export default AuthController;