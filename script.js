

// ---Buttons---
const buttonReset = function(event) {
    let button = event.target;
    console.log(`Button "${button.textContent}" reset.`);

    button.classList.remove("pressed"); // Removing darker background

    // Resetting listeners
    button.removeEventListener("mouseup", buttonReleased);
    button.removeEventListener("mouseleave", buttonReset);
}
const buttonReleased = function(event) {
    let button = event.target;
    console.log(`Button "${button.textContent}" released.`);

    buttonReset(event); // Resetting button to unclicked state

    
}
const buttonPressed = function(event) {
    let button = event.target;
    console.log(`Button "${button.textContent}" pressed.`);

    button.classList.add("pressed"); // Add dark background

    // Listeners
    button.addEventListener("mouseup", buttonReleased); // Finish click
    button.addEventListener("mouseleave", buttonReset); // Reset button without clicking
}

// Initializing buttons
const calcButtons = document.querySelectorAll(".calc-button");

for (const button of calcButtons) {
    button.addEventListener("mousedown", buttonPressed);
}
