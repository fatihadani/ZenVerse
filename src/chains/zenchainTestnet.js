import { defineChain } from 'viem'

export const zenchainTestnet = defineChain({
  id: 8408,
  name: 'Zenchain Testnet',
  network: 'zenchain-testnet',
  nativeCurrency: {
    name: 'Zenchain Test Coin',
    symbol: 'ZTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://zenchain-testnet.api.onfinality.io/public'],
    },
    public: {
      http: ['https://zenchain-testnet.api.onfinality.io/public'],
    },
  },
  blockExplorers: {
    default: { name: 'Zenchain Explorer', url: 'https://zenchain-testnet.api.onfinality.io/public' },
  },
  testnet: true,
});

