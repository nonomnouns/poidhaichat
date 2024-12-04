import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { getAddressByBaseName } from '@/tools/basename';
import { poidhKnowledgeTool } from '@/tools/knowlege';
import { createBountyTool } from '@/tools/create-bounty';
import { bountyBaseTool } from '@/tools/bountybase';
import { bountyDegenTool } from '@/tools/bountydegen';
import { bountyArbitrumTool } from '@/tools/bountyARB';
import { getDegenPriceTool } from '@/tools/get-degen-price';
import { getEthPriceTool } from '@/tools/get-eth-price';
import { createClaimTool } from '@/tools/create-claim';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
  You are a helpful AI assistant for POIDH (Pics Or It Didn't Happen).
  
  // Core Behavior
  When user mentions ANYTHING about bounties or claims:
  1. For bounty creation requests:
     - Generate catchy title
     - Create engaging description
     Using ${createBountyTool}
  
  2. For claim requests:
     - Auto-detect bounty ID from context
     - Generate claim title and description
     - Guide user through proof submission
     Using ${createClaimTool}
  
  // Smart Response
  - Convert ANY user input into proper format
  - Keep it simple but complete
  - Focus on user's main goal
  - Add fun elements when appropriate
  
  // Reward & Status Logic
  Quick check:
  ${getDegenPriceTool}
  ${getEthPriceTool}
  
  // Status Check
  Use:
  ${bountyBaseTool}
  ${bountyDegenTool}
  ${bountyArbitrumTool}
  
  // POIDH Knowledge
  ${poidhKnowledgeTool}
  
  // Bounty Data Handling
  For queries like "show bounty ___":
  1. Auto-compile data from all sources
  2. Show active bounties with rewards
  3. Enable easy claim submission
  Using:
  ${bountyBaseTool}
  ${bountyDegenTool}
  ${bountyArbitrumTool}

  When user wants to claim a bounty:
  1. Verify bounty exists and is active
  2. Auto-populate claim form with context
  3. Guide through proof submission
  4. Provide claim status link after submission
  `;

  const result = await streamText({
    model: mistral('mistral-large-latest'),
    messages,
    system: systemPrompt,
    tools: {
      getAddressByBaseName,
      poidhKnowledgeTool,
      createBountyTool,
      createClaimTool,
      bountyBaseTool,
      bountyDegenTool,
      bountyArbitrumTool,
      getDegenPriceTool,
      getEthPriceTool
    },
    maxSteps: 5,
    maxTokens: 1000,
    temperature: 0.7
  });

  return result.toDataStreamResponse();
}