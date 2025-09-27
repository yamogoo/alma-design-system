import { Router } from "express";

import { mockDB } from "@/mock/data";

const router = Router();

router.get("/", async (req, res, next) => {
  res.json(mockDB);
  res.status(200);
});

router.post("/", async (req, res, next) => {});

router.patch("/:id", async (req, res, next) => {});

router.delete("/:id", async (req, res, next) => {});

export default router;
