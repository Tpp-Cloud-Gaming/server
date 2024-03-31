import {User} from "../models/User.js"


export class UserController {
    constructor () {
        
    }
    getUsers = async (req,res) => {
        try {
            const Users = await User.findAll()
            res.json(Users)
        } catch (error) {
            return res.status(500).json({"message": error.message})
        }
    }
    createUser = async (req,res) => {
        const {name,email} = req.body
        try {          
            const newUser = await User.create({
                name,
                email
            });
            return res.json(newUser)
        } catch (error) {
            return res.status(400).json({"message": error.message})
        }
    }
}    
