// https://github.com/remarkablemark/react-blog-example
// https://codesandbox.io/s/x218ro09vq
/**
 * Capitalizes string.
 *
 * @param  {String} string
 * @return {String}
 */
const capitalize = string => {
  if (!string) return string;
  return string[0].toUpperCase() + string.slice(1);
};

/**
 * Capitalizes words.
 *
 * @param  {String} words
 * @return {String}
 */
export const capitalizeWords = words => {
  const wordsArray = words.split(' ');

  // single word
  if (wordsArray.length === 1) {
    return capitalize(words);
  }

  // multiple words
  return wordsArray.reduce((accumulatedWords, word) => {
    // first word
    if (!accumulatedWords) return capitalize(word);

    // empty array item
    if (!word) return accumulatedWords;

    // concatenate word
    return `${accumulatedWords} ${capitalize(word)}`;
  }, '');
};

let fullYear;

/**
 * Gets full year.
 *
 * @return {Number}
 */
export const getFullYear = () => {
  if (!fullYear) {
    fullYear = new Date().getFullYear();
  }
  return fullYear;
};

/**
 * Truncates text.
 *
 * @param  {String} text
 * @param  {Number} [limit]
 * @return {String}
 */
export const truncate = (text, limit) => {
  if (typeof text !== 'string') return '';

  if (text.length <= limit) return text

  if (text.length > limit) {
    // truncate string based on limit
    text = text.substring(0, limit);
  }

  // truncate to last whitespace if applicable
  const lastSpaceIndex = text.lastIndexOf(' ');
  if (lastSpaceIndex !== -1) {
    text = text.substring(0, lastSpaceIndex);
  }

  // trim trailing whitespace/periods
  text = text.replace(/[\s.]+$/g, '');
  return text + " [..]"
};

/**
 * Convert a Firebase timestamp to Date object
 *
 * @param  {Object} firebaseTimeStamp
 * @return {Date}
 */
export const getDateObject = (firebaseTimeStamp) => {
  if (!firebaseTimeStamp) {
    console.error("Could not find firebaseTimeStamp for post");
    return "";
  }
  var dateObj = firebaseTimeStamp.toDate();
  return new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
}
/**
 * Print a Date object to DD-MM-YYY HH:MM
 *
 * @param  {Date} dateObj
 * @return {String}
 */
export const getDateTime = (dateObj) => {
  if (!dateObj) return "";
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return (
    pad(dateObj.getDate()) +
    "-" +
    pad(dateObj.getMonth()) +
    "-" +
    dateObj.getFullYear() +
    " " +
    pad(dateObj.getHours()) +
    ":" +
    pad(dateObj.getMinutes())
  );
}
/**
 * Print a string with the time difference between the input Date and now
 *
 * @param  {Date} previous
 * @return {String}
 */
export const timeDifference = (previous) => {
  if (!previous) return "";
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerWeek = msPerDay * 7;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  const current = Date.now();
  var elapsed = current - previous;
  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerHour * 2) {
    return Math.round(elapsed / msPerHour) + " hour ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerDay * 2) {
    return Math.round(elapsed / msPerDay) + " day ago";
  } else if (elapsed < msPerWeek * 2) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerWeek) + " weeks ago";
  } else if (elapsed < msPerMonth * 2) {
    return Math.round(elapsed / msPerMonth) + " month ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } /*else if (elapsed < msPerYear * 2) {
    return Math.round(elapsed / msPerYear) + " year ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }*/ else {
    return this.getDateTime(previous);
  }
}