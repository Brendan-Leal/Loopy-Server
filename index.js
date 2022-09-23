import "./src/config/loadEnv.js";
import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.js";
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  console.log("Test route");
  res.json({ test: "Foo" });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
