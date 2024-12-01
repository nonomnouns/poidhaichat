import { z } from 'zod';
import axios from 'axios';
const getAddressByBaseNameSchema = z.object({
  baseName: z.string().describe('The base name to lookup, e.g., "jesse.base.eth"'),
});


const responseSchema = z.object({
  identity: z.object({
    address: z.string(),
    basename: z.string(),
  }),
  balance: z.object({
    ether: z.string(),
  })
});

export const getAddressByBaseName = {
  description: 'Get detailed information associated with a given base name, including address, balance, and social media links',
  parameters: getAddressByBaseNameSchema,
  execute: async ({ baseName }: z.infer<typeof getAddressByBaseNameSchema>) => {
    try {
      const response = await axios.get(`https://base.onchains.world/api/identity/${baseName}`);
      const validatedData = responseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      console.error('Error fetching address information:', error);
      throw error;
    }
  },
};