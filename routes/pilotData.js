const Pilot = require("../model/model");

//This is the API that the front-end uses to re-render
module.exports.getPilotData = async (req, res, next) => {
  const pilots = await Pilot.find({
    expires: {
      $gte: Date.now(),
    },
  });

  //Keep track of the overall closest distance
  const distances = pilots.map((p) => p.closestDistance);
  const currentLowest = Math.min(...distances);
  if (currentLowest < process.env.CLOSEST) process.env.CLOSEST = currentLowest;

  res.status(200).json({
    status: "success",
    data: {
      data: pilots,
      closest: process.env.CLOSEST,
    },
  });
};
