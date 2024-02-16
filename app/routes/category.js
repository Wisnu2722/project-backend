import { Router } from "express";
import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client";
import { Permission } from '../authorization.js'
import authToken from "../middlewares/auth-token.js";
import authorizePermission from "../middlewares/auth-permission.js";

const prisma = new PrismaClient();
const router = Router();

router.get("/categories", async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json({ message: "Data Categories", categories });
});

router.post("/categories", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "name is required",
        });
    }
    const category = await prisma.category.create({
        data: {
            name,
        },
    });
    res.json({ message: "success add to categories", category: category });
});

router.get("/categories/:id", async (req, res) => {
    const categoryId = req.params.id;
    const category = await prisma.category.findFirst({
        where: { id: Number(categoryId) },
    });
    res.json({ message: "Data Categories By ID", category });
});

router.put("/categories/:id", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }

    const categoryId = req.params.id;

    if (isNaN(categoryId)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
    }

    try {
        const category = await prisma.category.update({
            where: { id: Number(categoryId) }, // !!!!!!!!!
            data: { name },
        });
        res.json({ message: "Category updated successfully", category });
    } catch (err) {
        res.status(404).json({ message: "Not found" });
    }
});

// delete all categories


router.delete("/categories/:id", async (req, res) => {
    const categoryId = req.params.id;
    const category = await prisma.category.delete({
        where: { id: Number(categoryId) },
    });
    res.json({ message: "Data Category Successfully deleted", category });
});
export default router;