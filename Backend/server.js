import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import adminRoutes from "./src/routes/adminRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// Setting the allowed origin
const allowedOrigins = ["http://localhost:5173"]; 

app.use(
  cors ({
    origin : allowedOrigins,
    credentials: true,
  }),
);


// Routes
app.use("/admin", adminRoutes);

// Test DB connection and start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // Sync tables (without dropping existing ones)
    await sequelize.sync();
    console.log("✅ Tables synced successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
  }
}

startServer();
