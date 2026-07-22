import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import officeRoutes from "./src/routes/officeRoute.js";
import superAdminRoutes from "./src/routes/superAdminRoute.js";
import articleRoute from "./src/routes/articleRoute.js";
import backlogRoute from "./src/routes/backlogRoutes.js";

import helmet from "helmet";
import { seedAdminIfMissing } from "./src/seed/seedAdmin.js";
import sequelize from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoute.js";
import recordRoutes from "./src/routes/recordRoute.js";

import { Article } from "./src/models/index.js";
// import registerAuditListeners from "./src/listeners/auditListener.js";


const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(helmet());

app.use("/employees", employeeRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: () => 500,
});
app.use(speedLimiter);

app.use("/admin", adminRoutes);
app.use("/records", recordRoutes);
app.use("/offices", officeRoutes);
app.use("/superadmin", superAdminRoutes);
app.use("/items",articleRoute)
app.use("/logs", backlogRoute)

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed.");
    console.log(error);
    process.exit(1);
  }
}

startServer();