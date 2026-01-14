import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResponse = async (req, res, next) => {
  try {
    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: `
                You are a helpful assistant that crafts appropriate text message responses. 
      Consider the following guidelines:
      - Maintain a friendly and natural tone
      - Match the formality level of the incoming message
      - Keep responses concise and clear
      - Consider the context of the conversation
              `,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: req.body.transcript,
            },
          ],
        },
      ],
    });

    const result = await completion;

    if (!result) {
      return next('Error with response from openAi');
    }
    res.locals.aiResponse = result.choices[0].message;

    console.log('Browser Request ', req.body);
    console.log(result.choices[0].message);
    return next();
  } catch (error) {
    console.error('Error generating response', error);
  }
};
