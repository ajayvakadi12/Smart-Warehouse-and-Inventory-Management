const dotenv = require("dotenv");
const path = require("path");

// Load .env from project root or current backend folder
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const connectDB = require("./config/database");
const app = require("./app");

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

