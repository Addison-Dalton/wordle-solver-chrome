/* global chrome */
import { letterWeights, defaultAvailableWords } from '../utils/words.js';

let availableWords = defaultAvailableWords;

try {
  chrome.runtime.onMessage.addListener((message, sender) => {
    determineSuggestedWords(message.gameState);
    setGameState(message);
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      // console.log(
      //   `Storage key "${key}" in namespace "${namespace}" changed.`,
      //   `Old value was "${oldValue}", new value is "${newValue}".`
      // );
    }
  });
} catch (e) {
  console.log('Error in setting chrome events', e.message);
}

const setGameState = (message) => {
  const { gameState } = message;
  if (!gameState) return;

  chrome.storage.sync.set({ gameState });
}

const parseGameState = (gameState) => {
  const parsedGameState = JSON.parse(gameState);
  if (!parsedGameState) return undefined;

  const { boardState, evaluations } = parsedGameState;
  if (!boardState || !evaluations) return undefined;

  // removes empty strings
  const strippedBoardState = boardState.filter((word => word !== ''));
  const lastGuess = strippedBoardState.at(-1); // get last value of array
  if (!lastGuess) return undefined;

  // remove nulls
  const strippedEvaluations = evaluations.filter((evaluation => evaluation !== null));
  const lastEval = strippedEvaluations.at(-1);
  if (!lastEval) return undefined;

  const parsedGuess = lastGuess.split('').map((letter, idx) => {
    const evaluation = lastEval[idx];
    // if (evaluation === 'absent') {
    //   incorrectLetters.push(letter);
    // }

    return {
      letter,
      evaluation
    }
  });

  return parsedGuess;
}

const determineSuggestedWords = (gameState) => {
  const guessedWord = parseGameState(gameState);
  console.log('parsedGuess', guessedWord);
  if (!guessedWord) return;

  
  availableWords = filterAvailableWords(guessedWord);

  const wordsWithWeights = availableWords.map((word) => {
    const totalWeight = word.split('').reduce((weight, letter) => weight += getLetterWeight(letter), 0);
    return {
      word,
      weight: totalWeight
    }
  }).sort((a, b) => a.weight > b.weight);


  console.log('Top 5 suggested words: ', wordsWithWeights.slice(0, 5));
}

const getLetterWeight = (letter) => letterWeights.find((lw) => lw.letter === letter).weight;

// constructs a regex to test that string (available word) contains all present words in the guessed word
const presentLetterRegexConstructor = (presentLetters) => {
  const regexCaps = '[a-z]*';
  let regex = presentLetters.reduce((regexAcc, { letter }) => {
    return regexAcc += `(?=.*${letter})`;
  }, regexCaps);
  
  return regex += regexCaps;
}

// deconstructs the guessedWord into three arrays:
// incorrect letters, present letters, and correct letters
const deconstructGuessedWord = (guessedWord) => {
  const incorrectLetters = [];
  const presentLetters = [];
  const correctLetters = [];
  guessedWord.forEach(({ letter, evaluation }, idx) => {
    switch (evaluation) {
      case 'absent':
        incorrectLetters.push(letter);
        break;
      case 'present':
        presentLetters.push({
          letter,
          origIndex: idx
        });
        break;
      case 'correct':
        correctLetters.push({
          letter,
          origIndex: idx
        });
        break;
      default:
        break;
    }
  });

  return { incorrectLetters, presentLetters, correctLetters };
}

const filterAvailableWords = (guessedWord) => {
  const { incorrectLetters, presentLetters, correctLetters } = deconstructGuessedWord(guessedWord);

  return availableWords.filter(word => {
    // filter out words that contain incorrectLetters
    if (incorrectLetters.some(l => word.includes(l))) return false;

    // filter out words that don't contain correct letters
    if (correctLetters.some(({ letter, origIndex }) => word[origIndex] !== letter)) return false;
    // filter out words that don't contain present letters
    const regex = new RegExp(presentLetterRegexConstructor(presentLetters), 'g');
    if (!regex.test(word)) return false;

    // finally, filter out words that match present letters current index
    // since the correct word will have the present letter at a different index
    if (presentLetters.some(({ letter, origIndex }) => word[origIndex] === letter)) return false;
    return true;
  });
}