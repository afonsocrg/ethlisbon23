import { useState } from 'react';
import TruncatedText from '../components/TruncatedText';
import { protectDataFunc } from '../iexec/protectDataFunc';

import { Button, Table, Spin } from 'antd';

export default function EventsTab() {
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [events, setEvents] = useState([]);

  const eventColumns = [
    {
      title: 'Event name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Creation Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => text.toLocaleString(),
    },
    {
      title: 'Protected Address',
      dataIndex: 'protectedData',
      key: 'protectedData',
      render: (protectedData) => (
        <TruncatedText value={protectedData.address} />
      ),
    },
  ];

  const handleCreateEvent = (name, description) => {
    if (uploadingEvent) {
      return;
    }
    setUploadingEvent(true);
    const ts = new Date();
    const event = {
      name: name,
      description: description,
      created_at: ts,
    };
    // setUploadingEvent(true);
    // setTimeout(() => {
    //   setUploadingEvent(false);
    //   setEvents([...events, event]);
    // }, 3000);
    protectDataFunc(event, 'Event')
      .then((protectedData) => {
        console.log("protectedData", protectedData)
        event.protectedData = protectedData;
        setEvents([...events, event]);
        setUploadingEvent(false);
      })
      .catch((e) => {
        console.log('ERROR WHILE PROTECTING EVENT', e);
        setUploadingEvent(false);
      });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          style={{ display: 'block', margin: '20px auto' }}
          onClick={() =>
            handleCreateEvent('Created Plant', 'Event description')
          }
        >
          Create plant
        </Button>
        <Button
          style={{ display: 'block', margin: '20px auto' }}
          onClick={() =>
            handleCreateEvent('Watered plant', 'Event description')
          }
        >
          Water plant
        </Button>
        <Button
          style={{ display: 'block', margin: '20px auto' }}
          onClick={() =>
            handleCreateEvent('Disposed plant', 'Event description')
          }
        >
          Dispose plant
        </Button>
        <Button
          style={{ display: 'block', margin: '20px auto' }}
          onClick={() =>
            handleCreateEvent('Harvested plant', 'Event description')
          }
        >
          Harvest plant
        </Button>
      </div>

      <Table
        columns={eventColumns}
        dataSource={events}
        pagination={false}
        loading={uploadingEvent}
        locale={{
          emptyText: <div style={{ textAlign: 'center' }}>No data yet</div>,
        }}
      />
      {events.length === 0 && (
        <span style={{ textAlign: 'center' }}>No data yet</span>
      )}
      {uploadingEvent && (
        <Spin style={{ display: 'block', margin: '20px auto' }}></Spin>
      )}
      <Button
        style={{ display: 'block', margin: '20px auto' }}
        onClick={() => setEvents([])}
      >
        Reset events
      </Button>
    </div>
  );
}
