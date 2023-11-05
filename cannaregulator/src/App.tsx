import React from "react";
import MapComponent from "./MapComponent";
// import 'leaflet/dist/leaflet.css';
import {
  WagmiConfig,
  createClient,
  configureChains,
  useAccount,
  useDisconnect,
} from "wagmi";
import {
  EthereumClient,
  w3mProvider,
  w3mConnectors,
} from "@web3modal/ethereum";
import Connect from './Connect'
import { Web3Modal } from '@web3modal/react';

import { Button, List, Layout, Typography, Row, Col, Tag } from 'antd';

const { Header } = Layout;

const { Text } = Typography;

const bellecour = {
  id: 0x86,
  name: "iExec Sidechain",
  network: "bellecour",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    public: { http: ["https://bellecour.iex.ec"] },
    default: { http: ["https://bellecour.iex.ec"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Blockscout",
      url: "https://blockscout-bellecour.iex.ec",
    },
    default: { name: "Blockscout", url: "https://blockscout-bellecour.iex.ec" },
  },
};

const projectId = "b2e4ce8c8c62a7815f1b264f625182dd";




const wallet_mapper = {
  '0x6E7F6b8FF026FDad80566D02D8e8CB768faEA910': 'regulator',
  '0xA4CF6dB9Cf25D596DF639a8203A79C5D0bC6061d': 'laboratory',
  '0x55bcF12e9f4F3B81aE0408957303586d8176eE16': 'police',
}

const roleColors = {
  regulator: 'magenta',
  laboratory: 'green',
  police: 'blue',
  Unknown: 'default', // 'default' is a preset color for antd Tag for undefined roles
};

const chains = [bellecour];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  provider,
});

function ComponentHeader({ address, disconnect }) {
  // Function to shorten the address, implement this as needed
  const shortAddress = (address) => {
    // Your logic to shorten the address
    return address;
  };

  const getRole = (address) => {
    return wallet_mapper[address] || 'Unknown Role';
  };
  
  const getTagColor = (role) => {
    return roleColors[role] || 'default';
  };
  
  return (
    <Header
      style={{
        background: "transparent",
        padding: 0,
        width: "100%",
      }}
    >
      <Row justify="space-between" align="middle">
        <Col style={{ display: "flex", alignItems: "center" }}>

          <Tag color="blue" style={{ marginLeft: 8, padding: "5px 10px", borderRadius: 4 }}>
            {getRole(address)}
          </Tag>
          <Text
            style={{
              float: "right",
              marginRight: "8px",
              fontStyle: "italic",
            }}
          >
            {shortAddress(address)}

          </Text>
        </Col>
        <Col>
          <Button type="primary" htmlType="button" onClick={disconnect}>
            Disconnect
          </Button>
        </Col>
      </Row>
    </Header>
  );
}

const Dapp = () => {
  const { address, isConnected } = useAccount()

  const { disconnect } = useDisconnect();

  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {isConnected ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",width: "100%" }}>
            <ComponentHeader address={address} disconnect={disconnect} />
          <MapComponent owner_address={address} />
          
          </div> : <Connect />}
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        
    </div>
  );
}

const App = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <Dapp />
    </WagmiConfig>
  );
};

export default App;
