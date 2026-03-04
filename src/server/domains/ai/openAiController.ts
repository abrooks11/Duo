import OpenAI from 'openai';
import dotenv from 'dotenv';
import { AppError, handleControllerError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

dotenv.config();

const log = createChildLogger('openai');

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
      return next(new AppError('Error generating AI response', 500, 'OpenAI returned no result'));
    }
    res.locals.aiResponse = result.choices[0].message;

    log.debug({ request: req.body }, 'AI response generated');
    return next();
  } catch (error) {
    handleControllerError(error, 'generateResponse', next, 'Error generating AI response');
  }
};
