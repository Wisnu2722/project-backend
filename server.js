import { config } from "dotenv";
import app from "./app.js";

config();

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
