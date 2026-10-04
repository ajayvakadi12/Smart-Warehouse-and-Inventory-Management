const dotenv = require("dotenv");
const path = require("path");

// Load .env from project root (two levels above /backend/src/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = require("./config/database");
const app = require("./app");

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
