/**
Formats a quote and its author into a standardized string.
@param {string} text - The text content of the quote.
@param {string} [author] - The name of the author of the quote.
@returns {string} The formatted quote string (e.g., "Text" — Author).
*/
function formatQuote(text, author) {
  let displayauthor;
  if (author) {
    displayauthor = author;
  } else {
    displayauthor = "Anonymous";
  }
  return `"${text}" — ${displayauthor}`;
}
