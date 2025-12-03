// test-gemini.js - Run this to find available models
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

async function testGemini() {
  console.log('🔍 Testing Gemini API...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Check if API key exists
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file!');
    console.log('\n📝 To fix:');
    console.log('1. Go to https://aistudio.google.com/app/apikey');
    console.log('2. Click "Create API Key"');
    console.log('3. Add to .env: GEMINI_API_KEY=your_key_here\n');
    process.exit(1);
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 15) + '...\n');
  
  // Try to list models using direct API call
  console.log('📋 Fetching available models...\n');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
      console.error('Response:', errorText);
      
      if (response.status === 400) {
        console.log('\n🔧 Your API key appears to be invalid or expired.');
        console.log('Get a new one from: https://aistudio.google.com/app/apikey\n');
      } else if (response.status === 403) {
        console.log('\n🔧 API access forbidden. Check if:');
        console.log('1. You enabled the Generative Language API');
        console.log('2. Your API key has the right permissions\n');
      }
      
      process.exit(1);
    }
    
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      console.log('✅ Available models:\n');
      
      // Filter for models that support generateContent
      const generativeModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (generativeModels.length > 0) {
        console.log('🎯 Models that work with your API key:\n');
        generativeModels.forEach(model => {
          const modelName = model.name.replace('models/', '');
          console.log(`  ✓ ${modelName}`);
          if (model.displayName) console.log(`    Display: ${model.displayName}`);
        });
        
        // Test the first available model
        const testModelName = generativeModels[0].name.replace('models/', '');
        console.log(`\n🧪 Testing model: ${testModelName}\n`);
        
        const testResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${generativeModels[0].name}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'Say "Hello" in JSON: {"message": "Hello"}' }]
              }]
            })
          }
        );
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('✅ Model works! Response:');
          console.log(testData.candidates[0].content.parts[0].text);
          
          console.log(`\n\n🎉 SUCCESS! Use this model name in your code:`);
          console.log(`\n   model: "${testModelName}"\n`);
        } else {
          console.log('❌ Model test failed:', await testResponse.text());
        }
      } else {
        console.log('⚠️  No generative models found for this API key.');
      }
      
    } else {
      console.log('⚠️  No models found. Your API key might not have access.');
      console.log('\n🔧 Try:');
      console.log('1. Creating a new API key at https://aistudio.google.com/app/apikey');
      console.log('2. Enabling the Generative Language API in Google Cloud Console\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('1. Network connection problem');
    console.log('2. Invalid API key format');
    console.log('3. API key from wrong service (Vertex AI vs AI Studio)\n');
  }
}

testGemini().catch(console.error);

/*
HOW TO RUN:
node test-gemini.js

EXPECTED OUTPUT:
✓ gemini-1.5-pro
✓ gemini-1.5-flash
✅ Model works!

IF IT FAILS:
Get a NEW API key from: https://aistudio.google.com/app/apikey
*/