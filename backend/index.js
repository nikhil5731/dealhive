const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const connectDatabase = require("./utils/mongoConnect");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

connectDatabase();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoutes);

app.use("/api/v1", productRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT} Port`);
});
