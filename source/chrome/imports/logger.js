/* eslint-disable no-console */
export function log(...msg) {
  console.log(...msg);
}
export default log;

// auto log every message
chrome.runtime.onMessage.addListener((message) => {
  log(message);
});
