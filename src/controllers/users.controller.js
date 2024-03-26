import {User} from "../models/User.js"

export const getUsers = async (req,res) => {
    try {
        const Users = await User.findAll()
        res.json(Users)
    } catch (error) {
        return res.status(500).json({"message": error.message})
    }
}

export const createUser = async (req,res) => {
    const {name,email} = req.body
    try {          
        const newUser = await User.create({
            name,
            email
        });
        res.json(newUser)
    } catch (error) {
        return res.status(400).json({"message": error.message})
    }
}