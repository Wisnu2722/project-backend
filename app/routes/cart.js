import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();
router.get("/cart", async (req, res) => {
    const cart = await prisma.cart.findMany({
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
    res.json({ message: "Data Cart", cart });
});

router.post("/cart", async (req, res) => {
    const { product_id, quantity } = req.body;

    const product = await prisma.product.findUnique({
        where: { id: Number(product_id) },
    });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

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

    const cart = await prisma.cart.create({
        data: {
            product_id: product_id,
            quantity: quantity,
            total: total,
            user_id: 4,
        },
    });

    res.json({ message: "Cart created successfully", cart });
});

router.delete("/cart/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.cart.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Cart deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: "Cart item not found" });
    }
});

router.delete("/cart", async (req, res) => {
    await prisma.cart.deleteMany();
    res.json({ message: "Cart emptied successfully" });
});
export default router;