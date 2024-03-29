import { Router } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcrypt"
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";


const router = Router();
// router.use(authToken);

router.get("users", authToken, authorizePermission(Permission.BROWSE_USERS), async (req, res) => {
    const users = await prisma.user.findMany({});
    if (users.length === 0) {
        return res.status(404).send('Users not found')
    }
    return res.json(users);
})

router.get("/user/:id", authToken, authorizePermission(Permission.READ_USER), async (req, res) => {
    const id = req.params.id;
    if (id !== req.user.id) {
        return res.status(401).send('Unauthorized')
    }
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id),
        }
    })
    if (!user) {
        return res.status(404).send('User not found')
    }
    return res.json(user)
})

router.put("/user/:id", authToken, authorizePermission(Permission.EDIT_USER), async (req, res) => {
    const id = req.params.id;
    const{name, email, password} = req.body
    if (id !== req.user.id) {
        return res.status(401).json({message:'Unauthorized'})
    }

    // const user = await prisma.user.update({
    //     where: {
    //         id: Number(id),
    //     },
    //     data: {
    //         name,
    //         email,
    //         password: bcrypt.hashSync(password, 12)
    //     }
    // })
    // res.status(200).json({message:"profile updated", user: user})
})

// router.post("/users", authToken, authorizePermission(Permission.EDIT_USER), async (req, res) => {
//     req.body.password = bcrypt.hashSync(req.body.password, 12)
//     const user = await prisma.user.create({
//         data: req.body
//     })
// })

// router.delete("/users/:id", async (req, res) => {
//     const id = req.params.id
//     if (!id) {
//         return res.status(400).send('Missing parameter: id')
//     }
//     if (isNaN(id)) {
//         return res.status(400).send('Invalid ID')
//     }
//     const user = await prisma.user.delete({
//         where: {
//             id: Number(id),
//         }
//     })
// })

export default router