const path = require("path");
const express = require("express");
const overview = require("./routes/overview");
const pilotData = require("./routes/pilotData");
const cors = require("cors");

//Basic express router
const app = express();
const router = express.Router();

app.enable("trust proxy");

//I'm using pug to render the overview
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.options("*", cors());
//Serving static files
app.use(express.static(path.join(__dirname, "public")));

//Two routes, one for the overview and API for front-end re-rendering
router.get("/", overview.getOverview);
router.get("/api/getPilotData", pilotData.getPilotData);

app.use("/", router);

module.exports = app;
