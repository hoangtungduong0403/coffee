import express from "express";
import * as requestService from "../services/request.service.js";
import * as userService from "../services/user.service.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router();

// ---- public (customer app) ----

// customer submits a purchase request
router.post("/", async (req, res) => {
  const { phone } = req.body;

  let user = await userService.findByPhone(phone);
  if (!user) user = await userService.createUser(phone);

  const request = await requestService.createRequest(user.id);

  req.io.emit("new-request", {
    ...request,
    phone: user.phone,
  });

  res.json(request);
});

// ---- admin (JWT required) ----

router.use(authMiddleware);

// admin: list all
router.get("/", async (req, res) => {
  const data = await requestService.getAllRequests();
  res.json(data);
});

// admin: approve
router.post("/:id/approve", async (req, res) => {
  const request = await requestService.approveRequest(req.params.id);

  req.io.emit("request-approved", {
    requestId: request.id,
  });

  res.json(request);
});

// admin: reject
router.post("/:id/reject", async (req, res) => {
  const request = await requestService.rejectRequest(req.params.id);

  req.io.emit("request-rejected", {
    requestId: request.id,
  });

  res.json(request);
});

export default router;
