const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { logger } = require("./utils/logger");
const { registerUser, loginUser } = require("./controllers/user");
const userRoutes=require('./routes/users');
// Routes
// const authRoutes = require('./routes/auth.routes');
// const candidateRoutes = require('./routes/candidate.routes');
// const employeeRoutes = require('./routes/employee.routes');
// const referralRoutes = require('./routes/referral.routes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// // Routes
app.use('/api/auth', userRoutes);
// app.use('/api/auth/signin', loginUser);
// app.use('/api/candidates', candidateRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/referrals', referralRoutes);
app.use('/api/candidates', require('./routes/candidates'));

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log(`Request body, ${req.body}`);
  next();
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection error:', ${err}`);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.log(
    `Unhandled rejection at, promise: ${promise}, reason:${reason} `
  );
});
