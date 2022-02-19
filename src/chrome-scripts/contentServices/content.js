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
