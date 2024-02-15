import { Router } from "express";
import prisma from "../prisma.js"; 
import bcrypt from "bcrypt"


const router = Router();

router.get("users", async  (req, res) => {
    const users = await prisma.user.findMany({});
    if(users.length === 0){
        return res.status(404).send('Users not found')
    }
    return res.json(users);
    })

 // Get a user by ID
 router.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id),
        }
    })
    if(!user){
        return res.status(404).send('User not found')
    }
    return res.json(user)
})

router.post("/users", async (req, res) =>{
    req.body.password = bcrypt.hashSync(req.body.password, 12)
    const user = await prisma.user.create({
        data: req.body
    })
})

// delete user by id
router.delete("/users/:id", async (req, res) =>{
    const id = req.params.id
    if (!id){
        return res.status(400).send('Missing parameter: id')
    }
    if (isNaN(id)){
        return res.status(400).send('Invalid ID')
    }
    const user = await prisma.user.delete({
        where: {
            id: Number(id),
        }
    })
})

   
    // router.get("/users/:id", async (req, res) =>{
    //     const id = req.body.params
    //     if (!id){
    //         return res.status(400).send('Missing parameter: id')
    //     }
    //    try {
        
    //    } catch (error) {
        
    //    }
            
    

export default router