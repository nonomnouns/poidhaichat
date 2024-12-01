interface ContractAddresses {
    mainContract: string;
    nftContract: string;
  }
  
  export const contractAddresses: Record<number, ContractAddresses> = {
    // Degen Chain (666666666)
    666666666: {
      mainContract: '0x2445BfFc6aB9EEc6C562f8D7EE325CddF1780814',
      nftContract: '0xDdfb1A53E7b73Dba09f79FCA24765C593D447a80',
    },
    // Arbitrum One (42161)
    42161: {
      mainContract: '0x0Aa50ce0d724cc28f8F7aF4630c32377B4d5c27d',
      nftContract: '0xDdfb1A53E7b73Dba09f79FCA24765C593D447a80',
    },
    // Base (8453)
    8453: {
      mainContract: '0xb502c5856F7244DccDd0264A541Cc25675353D39',
      nftContract: '0xDdfb1A53E7b73Dba09f79FCA24765C593D447a80',
    },
  };
  
  export const getRewardType = (chainId: number): 'eth' | 'degen' => {
    return chainId === 666666666 ? 'degen' : 'eth';
  };