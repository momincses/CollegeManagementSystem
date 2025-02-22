const inappropriateWords = [
    "abuse", "hate", "violence", "racist", "sexist", "drugs", "kill", "murder", "terror", "bomb", 
    "fraud", "scam", "corrupt", "illegal", "crime", "theft", "harrass", "assault", "rape", "porn",
    "nude", "explicit", "gambling", "hack", "phish", "spam", "profanity", "slur", "curse", "swear",
    "discriminate", "offensive", "insult", "degrade", "bully", "troll", "extort", "blackmail", "bribe",
    "exploit", "trafficking", "molest", "prostitution", "kidnap", "abduction", "genocide", "hatecrime",
    "misogyny", "bigot", "homophobic", "xenophobia", 
];

const isComplaintClean = (complaint) => {
    const lowerCaseComplaint = complaint.toLowerCase(); // Normalize text
    return !inappropriateWords.some(word => lowerCaseComplaint.includes(word));  // true (if no bad words)
}

module.exports = { isComplaintClean };





// const fetch = require('node-fetch');

// const HF_API_KEY = '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; // Replace with your Hugging Face API key
// const HF_API_URL = 'https://api-inference.huggingface.co/models/unitary/toxic-bert';

// const isComplaintClean = async (complaint) => {
//     const response = await fetch(HF_API_URL, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${HF_API_KEY}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ inputs: complaint }),
//     });

//     const data = await response.json();
//     console.log(data); // Debugging: Check the API response

//     // Check if the content is toxic
//     if (Array.isArray(data) && data.length > 0) {
//         const scores = data[0]; // Array of scores for each label
//         const toxicScore = scores.find(score => score.label === 'toxic').score;
//         return toxicScore < 0.5; // Adjust threshold as needed
//     }

//     return true; // Assume clean if no data is returned
// };

// // Example usage
// (async () => {
//     const complaint = "This is a clean complaint.";
//     const isClean = await isComplaintClean(complaint);
//     console.log(isClean); // true or false
// })();

// module.exports = { isComplaintClean };



