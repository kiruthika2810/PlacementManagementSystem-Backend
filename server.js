
const dns = require("node:dns");

// DNS workaround for the MongoDB SRV lookup issue
dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Existing routes
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Placement Management System API",
      version: "1.0.0",
      description:
        "API documentation for the Placement Management System",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Temporary diagnostic endpoint
app.get("/test-swagger", (req, res) => {
  res.status(200).send("Backend route is working!");
});

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Existing API routes
app.use("/", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recruiters", recruiterRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Request error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server after database connection
async function startServer() {
  try {
    console.log("Starting file:", __filename);
    console.log("Connecting to MongoDB...");

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://127.0.0.1:${PORT}`);
      console.log(
        `Swagger documentation: http://127.0.0.1:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start the application:",
      error.message
    );
    process.exit(1);
  }
}

startServer();
