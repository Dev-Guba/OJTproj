import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import sequelize from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoute.js";
import recordRoutes from "./src/routes/recordRoute.js";

// Load models BEFORE sync
import "./src/models/index.js";

dotenv.config();

const app = express();

// ✅ CORS must be BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"], 
  })
);



app.use(express.json());

// Routes
app.use("/admin", adminRoutes);
app.use("/records", recordRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_NAME:", process.env.DB_NAME);
    console.log("DB_USER:", process.env.DB_USER);

    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    console.log("Loaded models:", Object.keys(sequelize.models));

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
}

startServer();