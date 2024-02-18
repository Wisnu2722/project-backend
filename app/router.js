import { Router } from "express";
import category from "./routes/category.js";
import product from "./routes/product.js";
import user from "./routes/user.js";
import login from "./routes/login.js";
import cart from "./routes/cart.js";
import order from "./routes/order.js";

const router = Router();
router.use(category);
router.use(product);
router.use(user);
router.use(login);
router.use(cart);
router.use(order);
export default router