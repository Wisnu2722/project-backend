import { Router } from "express";
import prisma from "../prisma.js";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";


const router = Router();
router.use(authToken);

router.get("/cart",  async (req, res) => {
    const cart = await prisma.cart.findMany({
        where: { user_id: Number(req.user.id) },
        include: {
            product: {
                select: {
                    name: true,
                },
            },
            user: {
                select: {
                    name: true,
                },
            },
        },
    });
    if (cart.length === 0) {
        return res.status(404).json({
            message: "data cart not found",
        });
    }
    res.status(200).json({ message: "Data Cart", cart });
});

router.post("/add-to-cart",  authorizePermission(Permission.ADD_TO_CART), async (req, res) => {


    const { product_id, quantity } = req.body;

    const product = await prisma.product.findUnique({
        where: { id: Number(product_id) },
    });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }


    if (product.in_stock == false) {
        return res.status(400).json({ message: "Product is Out of stock" });
    }
    res.json({ product });

    const existingCart = await prisma.cart.findFirst({
        where: { product_id: Number(product_id) },
    });

    let total = product.price * quantity;

    if (existingCart) {
        const newQuantity = existingCart.quantity + quantity;
        total = product.price * newQuantity;
        await prisma.cart.update({
            where: { id: existingCart.id },
            data: { quantity: newQuantity, total },
        });

        return res.json({ message: "Cart updated successfully" });
    }

    const user_id = req.user.id
    const cart = await prisma.cart.create({
        data: {
            product_id: product_id,
            quantity: quantity,
            total: total,
            user_id: user_id,
        },
    });

    res.json({ message: "item add to cart successfully", cart });
});

router.post("/cart/remove-item",  async (req, res) => {
    const user_id = req.user.id
    const { product_id } = req.body;

    try {
        await prisma.cart.delete({
            where: { user_id: Number(user_id), product_id: Number(product_id) },
        })

        res.status(200).json({ message: "Item successfully removed" });
    } catch (err) {
        res.status(404).json({ message: "Item not found" });
    }
});

// router.delete("/cart", async (req, res) => {
//     await prisma.cart.deleteMany();
//     res.json({ message: "Cart emptied successfully" });
// });
export default router;