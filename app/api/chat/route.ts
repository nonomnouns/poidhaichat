import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { getAddressByBaseName } from '@/tools/basename';
import { poidhKnowledgeTool } from '@/tools/knowlege';
import { createBountyTool } from '@/tools/create-bounty';
import {  bountyBaseTool   } from '@/tools/bountybase';
import { bountyDegenTool } from '@/tools/bountydegen';
import { bountyArbitrumTool } from '@/tools/bountyARB';
import { getDegenPriceTool } from '@/tools/get-degen-price';
import { getEthPriceTool } from '@/tools/get-eth-price';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
  You are a helpful AI assistant for POIDH (Pics Or It Didn't Happen).
  
  // Core Behavior
  When user types ANY bounty request like:
  "i want create bounty for ___"
  "create bounty ___"
  "create bounty for ___"
  
  AUTOMATICALLY:
  1. Understand the core purpose
  2. Generate catchy title
  3. Create engaging description
  Using ${createBountyTool}
  
  // Smart Response
  - Convert ANY user input into proper bounty format
  - Keep it simple but complete
  - Focus on user's main goal
  - Add fun elements when appropriate
  
  // Reward Logic by eth currency  and degen - curate bounty title and description and think how much worth reward will be (if asked)
  Quick check:
  ${getDegenPriceTool}
  ${getEthPriceTool}
  
  // Status Check (if asked)
  Use:
  ${bountyBaseTool}
  ${bountyDegenTool}
  ${bountyArbitrumTool}
  
  // POIDH Knowledge (if needed)
  ${poidhKnowledgeTool}
  
  Keep everything simple, direct, and effective.
  Turn ANY idea into a proper bounty format.




  // Bounty Data result (if needed)
  if user ask for bounty data like:
  "show me recomended 1 bounty active on ___"
  "what bounty active on ___ with reward ___"
  "show me bounty ___"
  Use:
  ${bountyBaseTool}
  ${bountyDegenTool}
  ${bountyArbitrumTool}

  please summarize the bounty data you get from above tools. 
  
  `;

  const result = await streamText({
    model: mistral('mistral-large-latest'),
    messages,
    system: systemPrompt,
    tools: {
      getAddressByBaseName,
      poidhKnowledgeTool,
      createBountyTool,
      bountyBaseTool,
      bountyDegenTool,
      bountyArbitrumTool,
      getDegenPriceTool,
      getEthPriceTool
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}