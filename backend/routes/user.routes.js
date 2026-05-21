import express from "express";
import * as userService from "../services/user.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

// ---- public (customer app) ----

// customer first-time check-in / lookup-or-create
router.post("/create-get-user", async (req, res) => {
  try {
    let phone = req.body.phone?.replace(/\D/g, "");

    if (!phone || phone.length < 9) {
      return res.status(400).json({ message: "Invalid phone" });
    }

    const user = await userService.createIfNotExist(phone);

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// customer self-redeem
router.post("/:id/redeem", async (req, res) => {
  const user = await userService.redeem(req.params.id);

  if (!user) return res.status(400).json({ message: "Not enough points" });

  res.json(user);
});

// ---- admin (JWT required) ----

router.use(authMiddleware);

// admin: create user
router.post("/", async (req, res) => {
  try {
    let phone = req.body.phone?.replace(/\D/g, "");

    if (!phone || phone.length < 9) {
      return res.status(400).json({ message: "Invalid phone" });
    }

    const existing = await userService.findByPhone(phone);

    if (existing) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const user = await userService.createIfNotExist(phone);

    res.status(201).json(user);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// admin: search by phone
router.get("/", async (req, res) => {
  try {
    let phone = req.query.phone?.replace(/\D/g, "");
    console.log("Searching for phone:", phone);
    if (!phone) return res.json([]);

    const user = await userService.findByPhoneLike(phone);

    if (!user) return res.json([]);

    res.json([user]);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// admin: get by id
router.get("/:id", async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });

  res.json(user);
});

// admin: add points
router.post("/:id/add", async (req, res) => {
  const { quantity } = req.body;

  const user = await userService.addPoints(req.params.id, quantity);
  res.json(user);
});

export default router;
