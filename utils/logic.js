const Pilot = require("../model/model");
const { XMLParser } = require("fast-xml-parser");
const axios = require("axios");

//This is the most important function of the back-end
//It checks the distance of aal the pilots and adds a pilot to the database
//if they are too close to the nest.
//Existing pilots get updated aswell.

const checkDistAndUpdate = async (pilots) => {
  pilots.forEach(async (p) => {
    //Calculate the distance
    const d = Math.round(
      Math.sqrt(
        Math.pow(250000 - p.positionX, 2) + Math.pow(250000 - p.positionY, 2)
      ) / 1000
    );

    if (d <= 100) {
      try {
        //Get pilot information from the API
        const res = await axios({
          method: "GET",
          url: `https://assignments.reaktor.com/birdnest/pilots/${p.serialNumber}`,
        });

        //Add a new pilot to the database or update an existing one
        const { email } = res.data;
        const pilot = await Pilot.findOne({ email });

        if (pilot) {
          if (d < pilot.closestDistance) res.data.closestDistance = d;
          res.data.expires = Date.now() + 1000 * 60 * 10;
          await Pilot.updateOne({ email }, res.data);
        } else {
          res.data.expires = Date.now() + 1000 * 60 * 10;
          res.data.closestDistance = d;
          await Pilot.create(res.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  });
};

//This function deletes pilots who have not not been too close for 10 minutes.
const findExpiredAndDelete = async () => {
  const time = Date.now();
  await Pilot.deleteMany({
    expires: {
      $lte: time,
    },
  });
};

const getDrones = async () => {
  const parser = new XMLParser();
  //Get all drones from the API
  try {
    const res = await axios({
      method: "GET",
      url: "https://assignments.reaktor.com/birdnest/drones",
    });
    const jObj = await parser.parse(res.data);
    //Calculate the distances of each drone and add the pilots to the database.
    //Delete expired ones.
    await checkDistAndUpdate(jObj.report.capture.drone);
    await findExpiredAndDelete();
  } catch (err) {
    console.log(err.message);
  }
};

//This is the main back-end loop which keeps the app running so to say.
const loop = () => {
  setInterval(async function () {
    await getDrones();
  }, 2000);
};

exports.loop = loop;
