import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { Tabs, Table, Tag, Modal, notification } from 'antd';
import { Pie, Bar } from '@ant-design/plots';
import logo from '../assets/canngov.svg';
import ContactsTab from './ContactsTab';
import farmsData from './farmsData';
import { fetchProtectedDataFunc } from '../iexec/protectDataFunc';
const { TabPane } = Tabs;

const mapStyles = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [{ saturation: -100 }, { gamma: 0.5 }],
  },
];
// Dummy data for the sake of example

const dummyBarChartData = [
  { year: '2021', value: 3 },
  { year: '2022', value: 4 },
  { year: '2023', value: 5.5 },
  // Add more data as needed
];

const getTagColor = (license) => {
  const colorMap = {
    GMP: 'green',
    GACP: 'blue',
    // Add more licenses and their associated colors as needed
  };
  return colorMap[license] || 'default'; // default color if license is not in the map
};

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
    render: (text) => text && new Date(text).toLocaleDateString(),
  },
  {
    title: 'Protected Address',
    dataIndex: 'protectedData',
    key: 'protectedData',
    render: (protectedData) => protectedData && <TruncatedText value={protectedData.address} />,
  },
];


const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Production capacity',
    dataIndex: 'production_capacity',
    key: 'production_capacity',
    sorter: (a, b) => a.production_capacity - b.production_capacity,
    // Add sorting or filtering if needed
  },


  // ...other columns
];

const dummyChartData = [
  {
    type: 'Indica',
    value: 50,
  },
  {
    type: 'Sativa',
    value: 30,
  },
  {
    type: 'Hybrid',
    value: 20,
  },
];

const MapComponent = ({ owner_address }) => {
  const [activeMarker, setActiveMarker] = React.useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [mapCenter, setMapCenter] = useState({
    lat: 39.3994124,
    lng: -9.0845949,
  });

  const [protectedData, setProtectedData] = useState([]);
  const [selectLocationData, setSelectLocationData] = useState([]);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const protectedData = await fetchProtectedDataFunc(owner_address);
        setProtectedData(protectedData);
      } catch (error) {
        console.log('error', error);
        notification.error({
          message: 'Error',
          description: String(error),
        });
      }
    };
    fetchProtectedData();
  }, []);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const protectedData = await fetchProtectedDataFunc(selectedLocation.address);
        console.log("protectedData", protectedData);
        setSelectLocationData(protectedData);

      } catch (error) {
        console.log("error", error);
        notification.error({
          message: "Error",
          description: String(error),
        });
      }
    };
    if (selectedLocation) {
      fetchProtectedData();
    }
  }, [selectedLocation]);


  const pieConfig = {
    appendPadding: 10,
    data: selectedLocation
      ? selectedLocation.cultivars_percentages
      : dummyChartData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  const barConfig = {
    data: selectedLocation
      ? selectedLocation.production_report
      : dummyBarChartData,
    xField: 'value',
    yField: 'year',
    seriesField: 'year',
    legend: { position: 'top-left' },
  };
  const renderInfoWindowContent = () => (
    <Tabs defaultActiveKey="1">
      <TabPane tab="General Info" key="1">
        <div>
          <h3>{selectedLocation.name}</h3>
          <p>
            <strong>Contact:</strong> {selectedLocation.phone}
          </p>
          <p>
            <strong>Email:</strong> {selectedLocation.email}
          </p>
          <p>
            <strong>Address:</strong> {selectedLocation.map_address}
          </p>
          <p>
            <strong>Production Capacity:</strong>{' '}
            {selectedLocation.production_capacity}
          </p>
          <p>
            <strong>Licenses:</strong> {selectedLocation.licenses.join(', ')}
          </p>
          <p>
            <strong>Website:</strong> {selectedLocation.website}
          </p>
          {/* ... Add more fields as needed */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginBottom: '20px' }}>
              <Pie {...pieConfig} />
            </div>
            <div>
              <Bar {...barConfig} />
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane tab="Actions" key="2">
        {/* <Table dataSource={dummyTableData} columns={columns} size="small" /> */}
        <Table
        columns={eventColumns}
        dataSource={selectLocationData}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center' }}>No data yet</div>
          ),
        }}

      />

      </TabPane>
    </Tabs>
  );

  const handleOnLoad = (map) => {
    // Fit map to marker bounds
    const bounds = new window.google.maps.LatLngBounds();
    farmsData.forEach((loc) => bounds.extend(loc.position));
    map.fitBounds(bounds);
  };

  const handleActiveMarker = (marker, location) => {
    setSelectedLocation(location);
    setActiveMarker(marker);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setActiveMarker(null);
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <img src={logo} alt="logo" style={{ width: '200px' }} />
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Farms" key="1">
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <LoadScript googleMapsApiKey="AIzaSyBiaF6BBgosRCYJP-pDAv4hI7nl5UZw2IM">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px' }}
                onLoad={handleOnLoad}
                // defaultCenter and defaultZoom are required props but they will be overridden by the fitBounds call
                defaultCenter={mapCenter}
                defaultZoom={7}
                options={{
                  styles: mapStyles,
                }}
              >
                {farmsData.map((loc) => (
                  <MarkerF
                    key={loc.id}
                    position={loc.position}
                    onClick={() => handleActiveMarker(loc.id, loc)}
                  />
                ))}
                {/* {activeMarker && (
          <InfoWindow
            position={farmsData.find((loc) => loc.id === activeMarker).position}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div style={{ width: '300px' }}>
              {renderInfoWindowContent()}
            </div>
          </InfoWindow>
        )}
         */}

                {isModalVisible && (
                  <Modal
                    title={
                      selectedLocation
                        ? selectedLocation.name
                        : 'Location Details'
                    }
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                    width={900}
                  >
                    {selectedLocation && renderInfoWindowContent()}
                  </Modal>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Table
              dataSource={farmsData}
              columns={columns}
              pagination={{ pageSize: 5 }}
              rowKey="key"
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setMapCenter({
                      lat: record.position.lat,
                      lng: record.position.lng,
                    });
                    handleActiveMarker(record.id, record);
                  }, // click row
                };
              }}
            />
          </div>
        </TabPane>
        <TabPane tab="Contacts" key="2">
          <ContactsTab protectedData={protectedData} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MapComponent;
