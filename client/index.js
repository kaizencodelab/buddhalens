const quote = document.getElementById('quote');
/* 
quote.classList.add(''); 
*/

//This is just temporary in order to see changes
quote.style.color = 'red';
quote.style.padding = '20px';
quote.style.fontSize = '1rem';

async function getBuddhaQuote() {
  try {
    const response = await fetch(`https://corsproxy.io/?https://buddha-api.com/api/random?t=${Date.now()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    quote.textContent = `"${data.text}" — ${data.byName}`;

  } catch (error) {
    console.error("Could not fetch quote:", error);
    quote.textContent = 'Could not load quote.';
  }
}

quote.addEventListener('click', getBuddhaQuote);
