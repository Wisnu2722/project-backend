import { Router } from "express";
import prisma from "../prisma.js";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";
import axios from "axios";

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

        res.json({ orders: orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("order/items/:id", authToken, async (req, res) => {
    const id = req.params.id;
    if(isNaN(id)){
        return res.status(400).json({message:'Invalid ID'})
    }
    if(id !== req.user.id){
        return res.status(403).json({message:'Forbidden'})
    }
    try {
        const items = await prisma.orderitem.findMany({
            where: { order_id: Number(id) },
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
        })
        res.status(200).json({ items: items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
})

router.get("/checkout", authToken, authorizePermission(Permission.EDIT_ORDER), async (req, res) => {
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

router.post("/pay", authToken, async (req, res) => {

    try {
        const data = req.body;
        const id = req.user.id;

        if (!id || !data) {
            return res
                .status(400)
                .json({ message: "Missing order or payment data" });
        }

        if (
            !data.order_id ||
            !data.cardNumber ||
            !data.cvv ||
            !data.expiryMonth ||
            !data.expiryYear
        ) {
            return res.status(400).json({
                message: "Missing required fields in order or payment data",
            });
        }

        if (
            isNaN(data.order_id) ||
            isNaN(data.cardNumber) ||
            isNaN(data.cvv) ||
            isNaN(data.expiryMonth) ||
            isNaN(data.expiryYear)
        ) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const order = await prisma.order.findFirst({
            where: { user_id: Number(id), id: Number(data.order_id) },
        });
        if (!order) {
            return res.status(401).json({ message: "Order not found" });
        }
        if (order.status === "paid") {
            return res.status(400).json({ message: "Order already paid" });
        }

        const dataPayment = {
            amount: order.total,
            cardNumber: data.cardNumber,
            cvv: data.cvv,
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
        };

        const paymentResponse = await axios.post(
            "http://localhost:3000/pay",
            dataPayment
        );

        if (paymentResponse.status === 200) {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "paid",
                },
            });
        } else {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "failed",
                },
            });
        }

        res.json({ message: "success", payment: paymentResponse.data });
    } catch (error) {
        res.status(500).json({
            message: "Payment failed",
            error: "Invalid card number"
        });
    }
});

export default router;