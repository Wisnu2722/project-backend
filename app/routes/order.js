import { Router } from "express";
import prisma from "../prisma.js";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";

const router = Router();
router.use(authToken);

router.get("/orders",  async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { user_id: Number(req.user.id) },
        orderBy: { date: "desc" },
    });
    res.json(orders);
});

router.post("/checkout",  async (req, res) => {
    try {

        const user_id = Number(req.user.id)
        const cartData = await prisma.cart.findMany({
            where: { user_id: user_id },
            include: { product: true },
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