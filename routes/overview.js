const Pilot = require("../model/model");

//This renders the overview page after hitting the '/' route
module.exports.getOverview = async (req, res, next) => {
  const pilots = await Pilot.find({
    expires: {
      $gte: Date.now(),
    },
  });

  //Keep track of the overall closest distance
  const distances = pilots.map((p) => p.closestDistance);
  const currentLowest = Math.min(...distances);
  if (currentLowest < process.env.CLOSEST) process.env.CLOSEST = currentLowest;

  res.status(200).render("overview", {
    title: "Birdnest",
    pilots,
    closest: process.env.CLOSEST,
  });
};
