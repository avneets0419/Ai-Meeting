// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateMeetingMetadata(fullSummary, transcript) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an AI assistant that analyzes meeting transcripts and summaries. Based on the following meeting summary and transcript, generate:

1. A concise meeting title (max 60 characters) the title should be related to meeting only.
2. A very short summary (max 150 characters) - this should be a one-line overview
3. A single label/category (e.g., "Sales", "Product", "Strategy", "Team Meeting", "Client Call", "Planning", "Review") rather than meeting

Format your response as JSON:
{
  "title": "Meeting title here",
  "shortSummary": "Very brief one-line summary here",
  "label": "Single category label"
}

Meeting Summary:
${fullSummary}

Transcript Preview:
${transcript.substring(0, 2000)}...

Respond ONLY with valid JSON, no other text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response and parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const metadata = JSON.parse(jsonMatch[0]);
    
    // Validate and sanitize the response
    return {
      title: metadata.title?.substring(0, 100) || 'Untitled Meeting',
      shortSummary: metadata.shortSummary?.substring(0, 200) || '',
      label: metadata.label?.substring(0, 30) || 'Meeting',
    };
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback to simple generation
    return {
      title: 'Meeting Transcript',
      shortSummary: fullSummary.substring(0, 150) + '...',
      label: 'Meeting',
    };
  }
}