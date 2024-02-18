import { Router } from "express";
import prisma from "../prisma.js";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";


const router = Router();

router.get("/cart", authToken, authorizePermission(Permission.READ_CART), async (req, res) => {
    const cart = await prisma.cart.findMany({
        include: {
            product: {
                select: {
                    name: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
            user: {
                select: {
                    name: true,
                },
            },
        },
        where: { user_id: Number(req.user.id) },
    });
    if (cart.length === 0) {
        return res.status(404).json({
            message: "data cart not found",
        });
    }
    res.status(200).json({ message: "Data Cart", cart });
});

router.post("/add-to-cart", authToken, authorizePermission(Permission.ADD_TO_CART), async (req, res) => {

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

    const existingCart = await prisma.cart.findFirst({
        where: { product_id: Number(product_id) },
    });

    
    let total = product.price * quantity;

    if (existingCart && existingCart.user_id == req.user.id) {
        const newQuantity = existingCart.quantity + quantity;
        total = product.price * newQuantity;
        await prisma.cart.update({
            where: { id: existingCart.id },
            data: { quantity: newQuantity, total },
        });

        return res.json({ message: "Cart updated successfully" });
    }

    const user_id = req.user.id
    const cartData = await prisma.cart.createMany({
        data: {
            product_id: product_id,
            quantity: quantity,
            total: total,
            user_id: user_id,
        },
    });

    res.json({ message: "item  successfully added to cart" });
});

router.delete("/cart/:id", authToken, authorizePermission(Permission.DELETE_CART), async (req, res) => {

    const user_id = req.user.id
    const { id } = req.params;

    try {
        const deletedItem = await prisma.cart.delete({
            where: {
                id: Number(id),
                user_id: Number(user_id),
            },
        });
        res.status(200).json({ message: "Item successfully removed from cart" });

    } catch (err) {
        res.status(404).json({ message: "Cart item not found" });
    }
});

export default router;