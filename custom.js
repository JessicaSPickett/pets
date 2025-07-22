// Grabbed elements inside my HTML
let form = document.querySelector("#petForm");
let result = document.querySelector("#petContainer");

// function to get API token getToken()/ boiler code w/ API token
function getToken() {
  return fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "XcUtefCwkAq65j6SZ0zy9tKjq9v5Fo2KfKdrCTipQyLhuiWXy0",
      client_secret: "OUtlBIa7VzmEpu8CHYFTEed3vupsXJQO94A139fX",
    }),
  })
    .then((res) => res.json())
    .then((data) => data.access_token);
}

// getAdoptablePets function to call API using the users input
function getAdoptablePets(zipCode, petType) {
  getToken().then((token) => {
    fetch(
      `https://api.petfinder.com/v2/animals?type=${petType}&location=${zipCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        displayPetData(data.animals);
      })
      .catch((error) => {
        console.error("Error", error);
        showError(" ERROR. ERROR.");
      });
  });
}

// Connected submit button to handleFormSubmit function
form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  let name = document.querySelector("#name").value;
  let email = document.querySelector("#email").value;
  let zipCode = document.querySelector("#zipCode").value;
  let petType = document.querySelector("#petType").value;
  let requiredFields = [name, email, zipCode, petType];

  // Checked for empty fields and alerted the user if needed
  for (let i = 0; i < requiredFields.length; i++) {
    if (requiredFields[i] === "") {
      alert("Please fill out all parts.");
      return;
    }
  }

  // if everything's good, move on and get the pets
  // called getAdoptablePets now that inputs are working
  getAdoptablePets(zipCode, petType);
}

// built displayPetData to show available pets on the page
function displayPetData(pets) {
  result.innerHTML = "<h2>Available Pets Near You:</h2>";

  // If no pets found, display a message
  if (!pets || pets.length === 0) {
    result.innerHTML += "<p>No pets found for this zip code! Try again!</p>";
    return;
  }

  // Loop through each pet and create a pet card
  pets.forEach((pet) => {
    let petElement = document.createElement("div");
    petElement.classList.add("pet-card");
    petElement.innerHTML = `
      ${
        Array.isArray(pet.photos) && pet.photos.length > 0
          ? `<img src="${pet.photos[0].medium}" alt="${pet.name}">`
          : `<p>No photo available</p>`
      }
      <p>Breed: ${pet.breeds.primary}</p>
      <p>Age: ${pet.age}</p>
      <p>Gender: ${pet.gender}</p>
    `;
    result.appendChild(petElement);
  });
}
