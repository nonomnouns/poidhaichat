import { z } from 'zod';
import { tool } from 'ai';

export const createClaimTool = tool({
  description: 'Generate claim details for a bounty',
  parameters: z.object({
    bountyId: z.string().describe('The ID of the bounty being claimed'),
    title: z.string().describe('The title of the claim'),
    description: z.string().describe('A detailed description of how the bounty was completed'),
    
  }),
  execute: async ({ bountyId, title, description }) => {
    return { 
      bountyId,
      title, 
      description
    };
  },
});
