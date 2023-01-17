//This function re-renders the page automatically for the front-end.
//This is done using vanilla JS and HTML since I don't know React :(
async function reRender() {
  try {
    //Get pilot data from the database
    const pilots = (
      await axios({
        method: "GET",
        url: "/api/getPilotData",
      })
    ).data.data;

    const pilotContainer = document.querySelector(".pilotContainer");
    const h2 = document.querySelector(".closest");

    //Remove all pilot cards from the page
    while (pilotContainer.firstChild) {
      pilotContainer.removeChild(pilotContainer.lastChild);
    }

    //Update the closest overall distance
    h2.innerText = `Overall closest distance: ${pilots.closest}m`;

    //For each pilot in the database, re-render the pilot card to the page
    pilots.data.forEach((pilot) => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `<p>Name: ${pilot.firstName} ${pilot.lastName}</p>
      <p>Email: ${pilot.email}</p>
      <p>Phone number: ${pilot.phoneNumber}</p>
                   <p>Closest recorded distance: ${pilot.closestDistance}m`;
      pilotContainer.append(d);
    });
  } catch (err) {
    console.log(err);
  }
}

//This interval keeps the front-end re-render loop running
setInterval(() => reRender(), 2000);
