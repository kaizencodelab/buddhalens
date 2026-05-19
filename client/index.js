const quote = document.getElementById('quote-content');

//TODO(pwtag2): This is just temporary in order to see changes
//Create a css class with appropriate styles
quote.style.color = 'red';
quote.style.padding = '20px';
quote.style.fontSize = '1rem';

function formatQuote(text, author) {
  let displayauthor;
  if (author) {
    displayauthor = author;
  } else {
    displayauthor = "Anonymous";
  }
  return `"${text}" — ${displayauthor}`;
}

//Fetches a random quote from buddha-api.com and displays it on the 'quote' element 
async function getBuddhaQuote() {
  try {
    // buddha-api.com blocks direct browser requests (CORS policy).
    // corsproxy.io acts as a middleman, fetching the data on our behalf and passing it back.
    const response = await fetch(`https://corsproxy.io/?https://buddha-api.com/api/random?t=${Date.now()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    //TODO(pwtag2): Replace with Ugyen-T's function
    const data = await response.json();
    quote.textContent = formatQuote(data.text, data.byName);

  } catch (error) {
    console.error("Could not fetch quote:", error);
    quote.textContent = 'Could not load quote.';
  }
}
getBuddhaQuote();
document.getElementById('quoteButton').addEventListener('click', getBuddhaQuote);
