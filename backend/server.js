import express from "express"
import env from "dotenv"

env.config()

const app = express();

app.get("/",(req,res))

app.listen(5001)