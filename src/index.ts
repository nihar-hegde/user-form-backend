import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers";
dotenv.config();

if (!process.env.PORT) {
  console.error("PORT not found");
}

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server Running on port: ${port}`);
});
