const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { messages, systemPrompt } = req.body;
  
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ message: 'No response from AI', error: data });
    }
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

module.exports = router;