import { Layout, Button, Tabs } from 'antd';
import { useAccount, useDisconnect } from 'wagmi';
import TruncatedText from '../components/TruncatedText';
import EventsTab from './EventsTab.jsx';
import NotifyAuthoritiesTab from './NotifyAuthoritiesTab.jsx';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

export default function ProducerPage() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();


  const handleDisconnect = () => {
    disconnect();
  };

  // Columns for the Authorities Table
  const tabItems = [
    {
      key: '1',
      label: 'Event Log',
      children: <EventsTab />
    },
    {
      key: '2',
      label: 'Notify Authorities',
      children: <NotifyAuthoritiesTab/>
    }
  ]
 
  return (
    <Layout>
      <>
        <Header style={{ backgroundColor: 'transparent' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontStyle: 'italic', color: 'black' }}>
              <TruncatedText value={address} />
            </div>
            <Button type="primary" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        </Header>
        <Content>
          <Tabs defaultActiveKey="1" items={tabItems}/>
        </Content>
      </>
    </Layout>
  );
}
