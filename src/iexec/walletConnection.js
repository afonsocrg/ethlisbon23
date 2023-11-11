import { Chain } from '@wagmi/core';
import { EthereumClient, w3mProvider, w3mConnectors } from '@web3modal/ethereum';
import { createClient, configureChains } from 'wagmi';

export const projectId = 'b2e4ce8c8c62a7815f1b264f625182dd';

const bellecour = {
  id: 0x86,
  name: 'iExec Sidechain',
  network: 'bellecour',
  nativeCurrency: {
    decimals: 18,
    name: 'xRLC',
    symbol: 'xRLC',
  },
  rpcUrls: {
    public: { http: ['https://bellecour.iex.ec'] },
    default: { http: ['https://bellecour.iex.ec'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'Blockscout',
      url: 'https://blockscout-bellecour.iex.ec',
    },
    default: { name: 'Blockscout', url: 'https://blockscout-bellecour.iex.ec' },
  },
}

const chains = [bellecour];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider,
});


export const ethereumClient = new EthereumClient(wagmiClient, chains);