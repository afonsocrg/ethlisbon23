import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { wagmiClient, projectId, ethereumClient } from '../iexec/walletConnection';
import { useAccount } from 'wagmi';
import Connect from '../components/Connect';
import ProducerPage from './ProducerPage';


export default function ProducerApp() {
    const { isConnected } = useAccount();
    return (
    <>
        <WagmiConfig client={wagmiClient}>
        { isConnected ? <ProducerPage/> : <Connect/> }
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
    );
}
