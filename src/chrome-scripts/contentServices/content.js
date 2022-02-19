/* global chrome */
window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getPageLocalStorage();
  }
})

const getPageLocalStorage = () => {
  chrome.runtime.sendMessage({
    gameState: localStorage['nyt-wordle-state']
  });
}

// TODO inject div into document to act as react root