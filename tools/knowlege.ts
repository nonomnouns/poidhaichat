import { z } from 'zod';

const poidhQuerySchema = z.object({
  topic: z.enum([
    'introduction',
    'concept',
    'howItWorks',
    'walletSetup',
    'funding',
    'networks',
    'bounties',
    'nfts',
    'fees',
    'technical',
    'support'
  ]).describe('The topic to query information about POIDH'),
});

const POIDH_KNOWLEDGE = {
  introduction: {
    content: `POIDH means "pics or it didn't happen". It's an app for paying people to do things without needing to know their personal information. Unlike traditional payment methods that require personal details (Venmo, PayPal, etc.), POIDH uses blockchain technology to enable anonymous transactions with visual proof.`,
    links: [
      { title: 'Website', url: 'https://poidh.xyz' }
    ]
  },

  concept: {
    content: `POIDH is built on public, decentralized blockchains, allowing users to create bounties where funds are held in a smart contract. The key features are:
    - Anonymous payments through crypto wallets
    - Visual proof requirement for task completion
    - Decentralized control of funds
    - No personal information needed
    - Automated payment upon task verification`,
  },

  howItWorks: {
    content: `The process works in these steps:
    1. A user creates a bounty by depositing ETH/DEGEN into the smart contract
    2. Others can submit claims with photo evidence
    3. The photo gets minted as an NFT
    4. If accepted, the bounty funds automatically transfer to the winner
    5. The NFT transfers to the bounty creator
    Bounty creators maintain full control and can cancel bounties at any time to retrieve their funds without permission from POIDH.`,
  },

  walletSetup: {
    content: `To use POIDH, users need a crypto wallet. While POIDH offers built-in wallet creation options (email signup or Coinbase Smart Wallet), Rainbow Wallet is recommended. Rainbow is available on:
    - iOS: App Store
    - Android: Play Store
    - Browser: Extension
    Browser users can connect by clicking "connect" after installing the extension. Mobile users should use Rainbow's built-in browser, accessible via the globe icon.`,
    links: [
      { title: 'Rainbow Wallet', url: 'https://rainbow.me' },
      { title: 'iOS App', url: 'https://apps.apple.com/us/app/rainbow-ethereum-wallet/id1457119021' },
      { title: 'Android App', url: 'https://play.google.com/store/apps/details?id=me.rainbow&hl=en' },
      { title: 'Browser Extension', url: 'https://rainbow.me/download' }
    ]
  },

  funding: {
    content: `To fund your wallet:
    - US users: Buy Ethereum on Coinbase.com
    - International users: Use Binance.com
    - For Degen Chain: Use https://www.degen.tips/ for DEGEN tokens
    Always send a small test amount first before sending larger amounts. Your wallet address starts with "0x" and is 42 characters long. The same address works across Arbitrum, Base, and Degen Chain.`,
  },

  networks: {
    content: `POIDH operates on three networks:
    1. Arbitrum (white/blue "A" logo)
    2. Base (blue circle logo)
    3. Degen Chain
    Network selection is crucial - sending to the wrong network can result in lost funds. The bounty's network can be identified from its URL or by connecting your wallet to the bounty page.`,
    links: [
      { title: 'Arbitrum Contract', url: 'https://arbiscan.io/address/0x0aa50ce0d724cc28f8f7af4630c32377b4d5c27d' },
      { title: 'Base Contract', url: 'https://basescan.org/address/0xb502c5856f7244dccdd0264a541cc25675353d39' },
      { title: 'Degen Chain Contract', url: 'https://explorer.degen.tips/address/0x2445BfFc6aB9EEc6C562f8D7EE325CddF1780814' }
    ]
  },

  bounties: {
    content: `Bounty features:
    - Unlimited submissions allowed per bounty
    - Only one winner can be selected per bounty
    - Secondary prizes can be sent manually using wallet addresses
    - Bounty creators maintain full control of funds
    - Can be cancelled and funds retrieved at any time
    - Submissions include photo evidence and text description
    - Claims are minted as NFTs`,
  },

  nfts: {
    content: `All POIDH submissions are minted as NFTs:
    - Images stored on IPFS via Pinata
    - Viewable on most NFT dashboards
    - Accessible via "my bounties" on POIDH site
    - Collections exist on all three supported networks
    More details about POIDH NFTs available at https://paragraph.xyz/@poidh/on-poidh-nfts`,
    links: [
      { title: 'Arbitrum Collection', url: 'https://opensea.io/collection/pics-or-it-didnt-happen-1' },
      { title: 'Base Collection', url: 'https://opensea.io/collection/pics-or-it-didnt-happen' },
      { title: 'Degen Chain Collection', url: 'https://explorer.degen.tips/token/0xDdfb1A53E7b73Dba09f79FCA24765C593D447a80' }
    ]
  },

  fees: {
    content: `Fee structure:
    - 2.5% fee on completed bounties
    - 5% suggested royalty fee for NFT resales
    - No fees for depositing/retrieving funds from unfulfilled bounties
    - Gas fees required for transactions (typically $0.01-$0.10)
    - Minimum recommended ETH balance: $5 for gas fees`,
  },

  technical: {
    content: `Technical details:
    - Built by warpcast.com/kenny and github.com/Rhovian
    - Open source project
    - Not formally audited - use with caution
    - Smart contracts available on GitHub
    - Data analytics available on Dune`,
    links: [
      { title: 'App Repository', url: 'https://github.com/picsoritdidnthappen/poidh-app' },
      { title: 'Contracts Repository', url: 'https://github.com/picsoritdidnthappen/poidh-contracts' },
      { title: 'Dune Analytics', url: 'https://dune.com/yesyes/poidh-pics-or-it-didnt-happen' }
    ]
  },

  support: {
    content: `Support channels:
    - Twitter/X: @poidhxyz
    - Farcaster: warpcast.com/~/channel/poidh
    - Email: poidhxyz@gmail.com
    Contact for submission removals or general support.`,
    links: [
      { title: 'Twitter', url: 'https://x.com/poidhxyz' },
      { title: 'Farcaster', url: 'https://warpcast.com/~/channel/poidh' }
    ]
  }
};


const poidhKnowledgeResponseSchema = z.object({
  topic: z.string(),
  content: z.string(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string()
  })).optional()
});

export const poidhKnowledgeTool = {
  description: 'Access comprehensive knowledge about POIDH (Pics Or It Didn\'t Happen) - a decentralized bounty platform for task completion with visual proof',
  parameters: poidhQuerySchema,
  execute: async ({ topic }: z.infer<typeof poidhQuerySchema>) => {
    const knowledge = POIDH_KNOWLEDGE[topic];
    if (!knowledge) {
      throw new Error(`No knowledge found for topic: ${topic}`);
    }
    
    return poidhKnowledgeResponseSchema.parse({
      topic,
      ...knowledge
    });
  },
};