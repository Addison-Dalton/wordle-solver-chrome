/* global chrome */
import { letterWeight, defaultAvailableWords } from '../utils/words.js';

// const incorrectLetters = [];
let availableWords = defaultAvailableWords;

try {
  chrome.runtime.onMessage.addListener((message, sender) => {
    determineSuggestedWords(message.gameState);
    console.log('message', message, 'sender', sender);
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
  console.log('availableWords', availableWords);
}

// constructs a regex to test that string (available word) contains all present words in the guessed word
const presentLetterRegexConstructor = (presentLetters) => {
  console.log('The present letters going into regex are: ', presentLetters);
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

  console.log('descontructed word arrays', incorrectLetters, presentLetters, correctLetters);

  return availableWords.filter(word => {
    console.log('=============================');
    console.log('word', word);
    // filter out words that contain incorrectLetters
    if (incorrectLetters.some(l => word.includes(l))) return false;
    console.log('word contains no incorrect letters');

    // filter out words that don't contain correct letters
    if (correctLetters.some(({ letter, origIndex }) => word[origIndex] !== letter)) return false;
    console.log('word contains correct letters');
    // filter out words that don't contain present letters
    const regex = new RegExp(presentLetterRegexConstructor(presentLetters), 'g');
    console.log('generated regex is: ', regex);
    if (!regex.test(word)) return false;
    console.log('word contains present letters');

    // finally, filter out words that match present letters current index
    // since the correct word will have the present letter at a different index
    if (presentLetters.some(({ letter, origIndex }) => word[origIndex] === letter)) return false;
    console.log('word contains no present letters are their current index');
    return true;
  });
}