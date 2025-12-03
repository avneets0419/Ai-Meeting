import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(process.env.GEMINI_API_KEY)

// List of model names to try in order
const MODEL_NAMES = [
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest", 
  "gemini-1.5-pro",
  "gemini-pro",
  "models/gemini-1.5-flash",
  "models/gemini-pro"
];

async function getWorkingModel() {
  // Try each model until one works
  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // Test if model works with a simple prompt
      console.log(`🧪 Testing model: ${modelName}`);
      await model.generateContent("test");
      console.log(`✅ Using model: ${modelName}`);
      return model;
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
      continue;
    }
  }
  throw new Error('No working Gemini model found. Please check your API key.');
}

export async function generateMeetingMetadata(fullSummary, transcript) {
  try {
    const model = await getWorkingModel();

    const prompt = `
You are an AI assistant that creates compelling meeting titles and summaries.

Analyze the following meeting content and create:

1. **Meeting Title** (max 60 characters):
   - Should be descriptive and professional
   - Capture the main topic or purpose
   - Examples: "Q4 Sales Review", "Product Launch Planning", "Client Onboarding Call"
   - DO NOT just copy the first line of the summary
   - DO NOT include bullet points or dashes

2. **Short Summary** (max 150 characters):
   - One clear sentence describing what happened
   - Use complete sentences, not bullet points
   - Be specific and informative

3. **Label** (single word or short phrase):
   - Choose from: Sales, Product, Strategy, Team Meeting, Client Call, Planning, Review, Technical, Marketing, HR, Finance, Operations, Training, or similar
   - Must be a category, not a topic

Meeting Summary:
${fullSummary}

Transcript Preview:
${transcript.substring(0, 3000)}

Respond ONLY with valid JSON in this exact format:
{
  "title": "Your Meeting Title Here",
  "shortSummary": "Your one-sentence summary here.",
  "label": "Category"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 Gemini raw response:', text);
    
    // Clean up the response and parse JSON
    let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const metadata = JSON.parse(jsonMatch[0]);
    
    // Post-process to remove bullet points if they sneak in
    let title = metadata.title || 'Untitled Meeting';
    let shortSummary = metadata.shortSummary || '';
    
    // Clean up title - remove leading dashes, bullets, numbers
    title = title.replace(/^[-•*\d.)\s]+/, '').trim();
    
    // Clean up short summary - remove leading dashes, bullets
    shortSummary = shortSummary.replace(/^[-•*\d.)\s]+/, '').trim();
    
    // Validate and sanitize the response
    return {
      title: title.substring(0, 100) || 'Untitled Meeting',
      shortSummary: shortSummary.substring(0, 200) || '',
      label: (metadata.label || 'Meeting').substring(0, 30),
    };
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    // Improved fallback logic
    let title = 'Meeting Transcript';
    let shortSummary = fullSummary.substring(0, 150);
    
    // Remove bullet points from summary
    const cleanSummary = fullSummary.replace(/^[-•*\d.)\s]+/gm, '').trim();
    
    // Try to create a title from the content
    if (cleanSummary.length > 0) {
      const firstSentence = cleanSummary.split(/[.!?]\n/)[0];
      
      // If first sentence is reasonable length, use it as basis for title
      if (firstSentence && firstSentence.length < 100) {
        title = firstSentence.substring(0, 60);
        if (firstSentence.length > 60) title += '...';
      }
      
      shortSummary = cleanSummary.substring(0, 150);
      if (cleanSummary.length > 150) shortSummary += '...';
    }
    
    return {
      title: title,
      shortSummary: shortSummary,
      label: 'Meeting',
    };
  }
}

// Optional: Function to list all available models (for debugging)
export async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log('📋 Available Gemini models:');
    for (const model of models) {
      console.log(`  - ${model.name}`);
    }
    return models;
  } catch (error) {
    console.error('Failed to list models:', error.message);
    return [];
  }
}