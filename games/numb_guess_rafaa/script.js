// Generate a random number between 1 and 100
const randomNumber = Math.floor(Math.random() * 100) + 1;

// Get references to the HTML elements
const guessInput = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const messageElement = document.getElementById('message');

// Define a variable to keep track of the number of guesses
let numberOfGuesses = 0;

// Define a function to check the user's guess
function checkGuess() {
  // Get the user's guess from the input element
  const userGuess = Number(guessInput.value);

  // Increment the number of guesses
  numberOfGuesses++;

  // Check if the user's guess is correct
  if (userGuess === randomNumber) {
    messageElement.innerHTML = `Congratulations, you guessed the number in ${numberOfGuesses} guesses!`;
    submitButton.disabled = true;
  } else if (userGuess < randomNumber) {
    messageElement.innerHTML = 'Too low, try again!';
  } else {
    messageElement.innerHTML = 'Too high, try again!';
  }
}

// Add an event listener to the submit button
submitButton.addEventListener('click', checkGuess);
