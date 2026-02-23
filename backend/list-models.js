const { GoogleGenerativeAI } = require('@google/generative-ai');
const key = 'AIzaSyB5M3Bm5TD4D3wdoeQ-yTLxL-hNI9lXjW8';
const genAI = new GoogleGenerativeAI(key);

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
