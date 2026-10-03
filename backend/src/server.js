const dotenv = require("dotenv");

dotenv.config();

/*require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env")
});*/

const connectDB = require("./config/database");
const app = require("./app");

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
