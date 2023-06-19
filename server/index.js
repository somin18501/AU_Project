const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoute");
const { DBConnection } = require('./database/db');
const PORT = 8000;

DBConnection();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);