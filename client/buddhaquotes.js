function formatQuote(text, author) {
let quote;

if (author) {
    quote = author;
  } else {
    quote = "Anonymous";
  }
  return `"${text}" — ${quote}`;
}
