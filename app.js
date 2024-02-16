import  express  from "express";
import router from "./app/router.js";


const app = express();
app.use(express.json());
app.use(router)

router.get("/", (req, res) => {
    res.send("Welcome to Backend APP!");
})

export default app