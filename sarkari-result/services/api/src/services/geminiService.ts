/**
 * Gemini AI Service — SERVER-ONLY.
 * All Gemini calls are made server-side. The API key never reaches the browser.
 */
import { GoogleGenAI } from '@google/genai';
import { config } from '../config';
import { logger } from '../lib/logger';

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

/**
 * Generates an article/content body for a notification using Gemini.
 */
export async function generateNotificationContent(params: {
  title: string;
  organization: string;
  category: string;
  shortDescription: string;
}): Promise<string> {
  const prompt = `
You are an expert content writer for a government jobs and recruitment portal in India called "Sarkari Result".
Write a comprehensive, SEO-friendly article for the following job/result notification.
The article should be in plain text (no markdown), informative, and helpful for job seekers.

Title: ${params.title}
Organization: ${params.organization}
Category: ${params.category}
Short Description: ${params.shortDescription}

Write a 3-4 paragraph article covering:
1. Overview of the notification
2. Eligibility and key requirements
3. How to apply / what candidates should do
4. Important dates and advice
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text ?? '';
  } catch (err) {
    logger.error({ message: 'Gemini content generation failed', error: err });
    return '';
  }
}

/**
 * Generates SEO meta description for a notification.
 */
export async function generateMetaDescription(params: {
  title: string;
  organization: string;
  totalVacancies: string;
}): Promise<string> {
  const prompt = `
Write a concise SEO meta description (max 155 characters) for this government job notification:
Title: ${params.title}
Organization: ${params.organization}
Vacancies: ${params.totalVacancies}

Output only the meta description text. No quotes. No markdown.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return (response.text ?? '').trim().slice(0, 155);
  } catch (err) {
    logger.error({ message: 'Gemini meta description failed', error: err });
    return '';
  }
}
