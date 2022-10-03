import express from "express";

const router = express.Router();

router.get("/access-token/:id");
router.get("refresh/token/:id")

export { router as tokenRouter };
