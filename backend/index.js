import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import userRoutes from "./routes/user.routes.js";
import requestRoutes from "./routes/request.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// inject socket into req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/users", userRoutes);
app.use("/requests", requestRoutes);
app.use("/auth", authRoutes);


server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});