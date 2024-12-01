import { z } from 'zod';
import { tool } from 'ai';
import { GraphQLClient, gql } from 'graphql-request';
import { formatEther } from 'viem';

const GOLDSKY_ENDPOINT = 'https://api.goldsky.com/api/public/project_cm43xsa45rx4s01t60zq6cd1r/subgraphs/poidh-degen-api/1/gn';

export const bountyDegenTool = tool({
  description: 'Retrieve active bounties from DEGEN chain',
  parameters: z.object({
  }),
  execute: async () => {
    const client = new GraphQLClient(GOLDSKY_ENDPOINT);

    const query = gql`
      query GetActiveBounties {
        bounties(
          where: { 
            inProgress: true
          },
          orderBy: createdAt,
          orderDirection: desc
        ) {
          id
          amount
          title
          description
          issuer {
            address
          }
        }
      }
    `;

    try {
      const { bounties } = await client.request<{ bounties: any[] }>(query);
      
      return bounties.map(bounty => ({
        id: bounty.id,
        title: bounty.title,
        description: bounty.description,
        amount: formatEther(BigInt(bounty.amount)),
        rewardType: 'DEGEN',
        issuer: bounty.issuer.address,
        link: `https://poidh.xyz/degen/bounty/${bounty.id}`
      }));
    } catch (error) {
      console.error('Error fetching degen bounties:', error);
      return [];
    }
  }
});