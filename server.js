const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logic = require("./utils/logic");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message, err);
  process.exit(1);
});

//Configure database
dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//Connect database
mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => {
  console.log("DB connection success");
});

//Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Start the back-end logic loop
logic.loop();

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION");
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});
