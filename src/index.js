let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  // DOM References
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Toggle toy form visibility
  addBtn.addEventListener("click", toggleToyForm);

  // Load all toys initially
  fetchToys();

  // Form submission handler
  toyForm.addEventListener("submit", handleToyFormSubmit);

  // Like button clicks (event delegation)
  toyCollection.addEventListener("click", handleLikeClick);

  /**
   * Toggle the visibility of the toy form
   */
  function toggleToyForm() {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  }

  /**
   * Fetch all toys from API and render
   */
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((res) => res.json())
      .then((toys) => {
        toyCollection.innerHTML = "";
        toys.forEach(renderToy);
      })
      .catch(handleError);
  }

  /**
   * Render a single toy card in the DOM
   * @param {Object} toy - Toy object from API
   */
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
  }

  /**
   * Handle submission of new toy form
   * @param {Event} event
   */
  function handleToyFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(toyForm);

    const newToy = {
      name: formData.get("name").trim(),
      image: formData.get("image").trim(),
      likes: 0,
    };

    if (!newToy.name || !newToy.image) {
      alert("Please enter both name and image URL.");
      return;
    }

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((res) => res.json())
      .then((toy) => {
        renderToy(toy);
        toyForm.reset();
        toggleToyForm(); // hide form
      })
      .catch(handleError);
  }

  /**
   * Handle like button click using event delegation
   * @param {Event} event
   */
  function handleLikeClick(event) {
    if (event.target.classList.contains("like-btn")) {
      const button = event.target;
      const toyId = button.dataset.id;
      const likeText = button.previousElementSibling;
      const currentLikes = parseInt(likeText.textContent) || 0;
      const updatedLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: updatedLikes }),
      })
        .then((res) => res.json())
        .then((updatedToy) => {
          likeText.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(handleError);
    }
  }

  /**
   * Generic error handler
   * @param {Error} error
   */
  function handleError(error) {
    console.error("An error occurred:", error);
    alert("Oops! Something went wrong. Please try again.");
  }
});
