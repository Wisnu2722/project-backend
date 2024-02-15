import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.get("/orders", async (req, res) => {
    const orders = await prisma.order.findMany({
        orderBy: { date: "desc" },
    });
    res.json(orders);
});

router.post("/orders", async (req, res) => {
    try {
        const cartData = await prisma.cart.findMany({
            where: { user_id: 4 },
            include: { product: true },
        });

        const total = cartData.reduce((acc, item) => acc + item.total, 0);

        const order = await prisma.order.create({
            data: {
                user_id: 4,
                date: new Date(),
                number: `ABC/${Math.floor(Math.random() * 1000)}`,
                total,
            },
        });

        const orderItems = cartData.map((item) => {
            return {
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product.price,
                total: item.total,
            };
        });

        await prisma.orderItem.createMany({ data: orderItems });

        // await prisma.cart.deleteMany();
        // res status and message
        res.json({
            message: "Order created successfully",
        })

        res.json({ message: "Order created successfully", order });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;