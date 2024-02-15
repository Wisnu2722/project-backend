import { Router } from "express";
import category from "./routes/category.js";
import product from "./routes/product.js";
import user from "./routes/user.js";
import token from "./routes/token.js";

const router = Router();
router.use(category);
router.use(product);
router.use(user);
router.use(token);
export default router