import { z } from 'zod';
import { tool } from 'ai';

export const getDegenPriceTool = tool({
  description: 'Get current DEGEN token price in USD from CoinGecko',
  parameters: z.object({}),
  execute: async () => {
    try {
      const apiKey = process.env.COINGECKO_API_KEY;
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=degen-base&vs_currencies=usd',
        {
          headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': apiKey || 'CG-jWrNfeNSa446NH5eDMJye7MR'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch DEGEN price');
      }

      const data = await response.json();
      return {
        price: data['degen-base'].usd,
        currency: 'USD',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: 'Failed to fetch DEGEN price',
        timestamp: new Date().toISOString()
      };
    }
  },
});
