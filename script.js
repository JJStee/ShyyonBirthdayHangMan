  const wordElement = document.getElementById("word");
  const incorrectElement = document.getElementById("incorrect");
  const messageElement = document.getElementById("message");
  const inputElement = document.getElementById("input");
  const submitButton = document.getElementById("submit");
  
  
// Add the hangman stages as an array at the beginning of the script
const hangmanStages = [
    `
    +---+
        |
        |
        |
       ===`,
    `
    +---+
    |   |
        |
        |
       ===`,
    `
    +---+
    |   |
    O   |
        |
       ===`,
    `
    +---+
    |   |
    O   |
    |   |
       ===`,
    `
    +---+
    |   |
    O   |
   /|   |
       ===`,
    `
    +---+
    |   |
    O   |
   /|\u005C  |
       ===`,
    `
    +---+
    |   |
    O   |
   /|\u005C |
   /    ===`,
    `
    +---+
    |   |
    O   |
   /|\u005C  |
   / \u005C ===`,

   `
   
   `
  ];
  
  const hangmanElement = document.getElementById("hangman");
  
  const words = ["doodool tala", "gooz", "ankle bone", "a bridge i would like to cross", "the noodle makers undercooked noodle","sucking borutos", "sexy cringe", "uber eats", "chupapi munyanyo", "if you were a fruit you would be a rizzberry"];
  
  let wordIndex = 0;
  
  function getNextWord() {
    if (wordIndex >= words.length) {
      wordIndex = 0;
    }
    return words[wordIndex++];
  }
  
  let selectedWord = getNextWord();
  
  let guessedLetters = [];
  let incorrectLetters = [];
  
  function displayWord() {
    wordElement.innerHTML = selectedWord
      .split(" ")
      .map(word => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word
          .split("")
          .map(letter => {
            // Automatically include spaces in the guessedLetters array
            if (letter === " " && !guessedLetters.includes(letter)) {
              guessedLetters.push(letter);
            }
            return guessedLetters.includes(letter) ? letter : "_";
          })
          .join("");
        return wordSpan.outerHTML;
      })
      .join(" ");
  }
  
  function checkLetter(letter) {
    if (selectedWord.includes(letter)) {
      guessedLetters.push(letter);
    } else {
      incorrectLetters.push(letter);
    }
    displayWord();
    incorrectElement.textContent = incorrectLetters.join(", ");
  }
  
  let countdownInterval;

  function countdown(seconds, callback) {
    clearInterval(countdownInterval); // Clear any existing interval
    const endTime = new Date().getTime() + seconds * 1000;
  
    countdownInterval = setInterval(() => {
      const remainingSeconds = Math.ceil((endTime - new Date().getTime()) / 1000);
      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        callback();
      } else {
        messageElement.textContent = `Next word in ${remainingSeconds} seconds...`;
      }
    }, 1000);
  }
  
  function resetGame() {
    guessedLetters = [];
    incorrectLetters = [];
    selectedWord = getNextWord();
    displayWord();
    updateHangman();
    submitButton.disabled = false;
    messageElement.textContent = "";
  
    const hintElement = document.getElementById("hint");
    hintElement.textContent = `Hint: ${selectedWord.replace(/ /g, "").length} letters`;
  }
  
  
  
  function checkGameStatus() {
    if (selectedWord.split("").every(letter => guessedLetters.includes(letter) || letter === " ")) {
      messageElement.textContent = "You got it!";
      countdown(10, () => {
        resetGame();
        incorrectElement.textContent = "";
      });
    } else if (incorrectLetters.length >= 7) {
      messageElement.textContent = `The word was "${selectedWord}".`;
      countdown(10, () => {
        resetGame();
        incorrectElement.textContent = "";
      });
    }
  }
  

  
  
  function updateHangman() {
    hangmanElement.innerHTML = hangmanStages[incorrectLetters.length] || hangmanStages[hangmanStages.length - 1];
  }
  
  displayWord();
  updateHangman();
  
  submitButton.addEventListener("click", () => {
    const letter = inputElement.value.toLowerCase();
    if (letter && !guessedLetters.includes(letter) && !incorrectLetters.includes(letter)) {
      checkLetter(letter);
      updateHangman();
      checkGameStatus();
    }
    inputElement.value = "";
  });
