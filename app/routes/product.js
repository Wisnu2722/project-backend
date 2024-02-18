import { Router } from "express";
import prisma from "../prisma.js";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";

const router = Router();

router.get("/products",  authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
    const products = await prisma.product.findMany({
        include: {
            category: {
                include: {
                    name: true,
                },
            },
        },
    });
    if (products.length === 0) {
        return res.status(404).json({
            message: "data products not found",
        });
    }
    res.json({ message: "data products", products: products });
});

router.post("/products",  authorizePermission(Permission.ADD_PRODUCTS), async (req, res) => {
    const { name, category_id, price, in_stock, description } = req.body;
    if ((!name, !category_id, !price, !in_stock, !description)) {
        return res.status(400).json({
            message: "name, category, price, in_stock, description is required",
        });
    }
    try {
        const product = await prisma.product.create({
            data: {
                name,
                category_id,
                price,
                in_stock,
                description,
            },
        });
        res.json({ message: "data products successfully added", product: product });
    } catch (err) {
        res.status(404).json({ message: "Not found" });
    }
});

router.get("/products/:id", authorizePermission(Permission.READ_PRODUCT), async (req, res) => {
    const productsId = req.params.id;
    if (isNaN(productsId)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
    }
    
    const product = await prisma.product.findFirst({
        where: { id: Number(productsId) },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
        },
    });
    if (product === null) {
        return res.json({ message: "Product Not Found" });
    }
    res.json({ message: "Data Products By ID", product });
});

router.put("/products/:id", async (req, res) => {
    const { name, category_id, price, in_stock, description } = req.body;

    if (!name || !category_id || !price) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    const productId = req.params.id;

    if (isNaN(productId)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
    }

    try {
        const product = await prisma.product.update({
            where: { id: Number(productId) }, // !!!!!!!!!
            data: { name, category_id, price, in_stock, description },
        });
        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        res.status(404).json({ message: "Data Products Not found" });
    }
});

router.delete("/products/:id", authToken, authorizePermission(Permission.DELETE_PRODUCT), async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await prisma.product.delete({
            where: { id: Number(productId) },
        });
        res.json({ message: "Data Products delete", product: product });
    } catch (err) {
        res.status(404).json({ message: "Data Product Not Found" });
    }
    
});


router.get("/products/search", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
    const keyword  = req.query.search;
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: keyword,
            },
            description: {
                contains: keyword,
            }
        }
    })
    res.json({ products })
})
export default router;





