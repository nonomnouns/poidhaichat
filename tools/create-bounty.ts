import { z } from 'zod';
import { tool } from 'ai';

export const createBountyTool = tool({
  description: 'Generate bounty details based on user input',
  parameters: z.object({
    title: z.string().describe('The title of the bounty'),
    description: z.string().describe('A detailed description of the bounty'),
  }),
  execute: async ({ title, description }) => {
    return { title, description };
  },
});