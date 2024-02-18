import { Router } from "express";
import prisma from "../prisma.js";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";

const router = Router();

router.get("/orders", authToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            select: {
                id: true,
                number: true,
                created_at: true,
                total: true,
            },
            where: { user_id: Number(req.user.id) },
            orderBy: { created_at: "desc" },
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'you dont have any orders' })
        }

        res.json({orders:orders});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/checkout", authToken, async (req, res) => {
    const user_id = Number(req.user.id)
    
    try {
        const cartData = await prisma.cart.findMany({
            where: { user_id: user_id },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true,
                        category: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: { created_at: "desc" },
        });

        const total = cartData.reduce((acc, item) => acc + item.total, 0);

        const order = await prisma.order.create({
            data: {
                user_id: user_id,
                date: new Date(),
                number: `ORD/${Math.floor(Math.random() * 1000)}`,
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

        await prisma.cart.deleteMany({
            where: { user_id: user_id },
        });

        res.status(200).json({ message: "Order created successfully", order });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/order/pay", authToken,  async (req, res) => {
    const {order_id, amount, cardNumber, cvv, expiryMonth, expiryYear} = req.body
    vali
    await prisma.order.update({
        where: { id: Number(order_id) },
    }) 

});

export default router;