import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import hpp from "hpp";

import { seedAdminIfMissing } from "./src/seed/seedAdmin.js";
import sequelize from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoute.js";
import recordRoutes from "./src/routes/recordRoute.js";

import "./src/models/index.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1); 
/* ==============================
   🔐 SECURITY HEADERS
============================== */
app.use(helmet());

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

/* ==============================
   🔐 CORS (STRICT)
============================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

/* ==============================
   🔐 BODY LIMIT (Anti-DDoS)
============================== */
app.use(express.json({ limit: "10kb" }));

/* ==============================
   🔐 Prevent HTTP Parameter Pollution
============================== */
app.use(hpp());


/* ==============================
   🔐 RATE LIMITING (Global)
============================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/* ==============================
   🔐 SLOW DOWN (Bot protection)
============================== */
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: 500,
});
app.use(speedLimiter);

/* ==============================
   ROUTES
============================== */
app.use("/admin", adminRoutes);
app.use("/records", recordRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced.");

    await seedAdminIfMissing();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed.");
    process.exit(1);
  }
}

startServer();