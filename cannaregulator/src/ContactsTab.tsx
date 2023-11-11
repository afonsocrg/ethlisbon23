
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Popover,
  notification,
} from "antd";
import {
  protectDataFunc,
  grantAccessFunc,
  revokeAccessFunc,
  fetchGrantedAccess,
} from "./protectDataFunc";
import Loading from "./Loading";
import { fetchMyContacts } from "./web3mail";
import farmsData from "./farmsData";

export default function ContactsTab({ protectedData }) {
  const [isAddContactModalVisible, setIsAddContactModalVisible] =
    useState(false);
  const WEB3MAIL_APP_ENS = "web3mail.apps.iexec.eth";

  const [contacts, setContacts] = useState([]); // This will store your main contacts data
  const [grantedFarms, setGrantedFarms] = useState([]); // This will store your farms data
  const [loadingProtect, setLoadingProtect] = useState(false);
  const [loadingGrant, setLoadingGrant] = useState(false);
  const [loadingRevoke, setLoadingRevoke] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setContacts(
      protectedData.map((item) => ({
        ...item,
      }))
    );
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // add farms to contacts
    const fetchFarmsForAddress = async (data_address, user_address) => {
      try {
        const farms_addresses = await fetchGrantedAccess(data_address, user_address);

        return farms_addresses;
      } catch (error) {
        notification.error({
          message: "Error",
          description: String(error),
        });
      }
    };

    const updateFarms = async () => {
      const updatedFarms = await Promise.all(
        contacts.map(async (contact) => {
          
          let _farms_addresses = [];

          for (const farm of farmsData) {
            const farms_addresses = await fetchFarmsForAddress(contact.address, farm.address);
            
            if (farms_addresses.length > 0) {
              _farms_addresses.push(farm.address);
              };
            }

            return {
              [contact.address]: _farms_addresses,
            };

          })
      );

      setGrantedFarms(updatedFarms);
    };

    if (contacts.length > 0) {
      updateFarms();
    }
  }, [contacts]);


  const handleRevokeAccess = (contactIndex, farmIndex) => {
    // Implement the logic to revoke access to a single farm here
  };

  const protectedDataSubmit = async (data, name) => {
    try {
      setLoadingProtect(true);
      const ProtectedDataAddress = await protectDataFunc(data, name);
      console.log("ProtectedDataAddress", ProtectedDataAddress);
      setContacts([
        ...contacts,
        {
          name,
          address: ProtectedDataAddress,
        },
      ]);

      setGrantedFarms([
        ...grantedFarms,
        {
          [ProtectedDataAddress]: [],
        },
      ]);
    } catch (error) {
      notification.error({
        message: "Error",
        description: String(error),
      });
    }
    setLoadingProtect(false);
  };

  const handleAddContactSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        protectedDataSubmit(
          {
            email: values.email,
          },
          values.name
        );
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleAddContact = () => {
    setIsAddContactModalVisible(true);
  };

  const address_columns = [
    {
      title: "Address Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Protected Address",
      dataIndex: "address",
      key: "address",
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (text, record, index) => {
    //     // Popover content with the list of farms
    //     const content = (
    //       <div>
    //         {farmsData.map((farm) => (
    //           <div key={farm.id}>
    //             <Checkbox
    //               onChange={() =>
    //                 handleFarmAccessChange(farm.address, record, index)
    //               }
    //             >
    //               {farm.name}
    //             </Checkbox>
    //           </div>
    //         ))}
    //       </div>
    //     );

    //     return (
    //       <>
    //         {/* <Popover
    //           content={content}
    //           title="Add Access to Farm"
    //           trigger="click"
    //         >
    //           <Button>Add Access to Farm</Button>
    //         </Popover> */}
    //         <Button danger onClick={() => handleRevokeAll(index)}>
    //           Revoke All
    //         </Button>
    //       </>
    //     );
    //   },
    // },
  ];

  // Define the sub-table columns for the farms
  const farmColumns = (parent_record) => {
    return [
      {
        title: "Farm Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Actions",
        key: "actions",
        render: (text, record, index) => {
  
          const grantedFarmsForAddress = grantedFarms.find((item) => {
            return Object.keys(item)[0] === parent_record.address
          })
  
          const isGranted = record.address && grantedFarmsForAddress[parent_record.address].includes(record.address);


          return (
            <>
              {isGranted ? (
                <Button danger onClick={() => handleRevokeAccess(index)}>
                  Revoke Access
                </Button>
              ) : (
                <Button
                  onClick={() => handleFarmAccessChange(parent_record.address, record.address, index)}
                >
                  Grant Access
                </Button>
              )}
         
  
            
            </>
            
          )
        }
  
      },
    ];

  } 

  const handleFarmAccessChange = async (farm_address, data_address, index) => {
    // Logic to handle checkbox change
    // For example, you could add or remove access to a farm based on the checkbox state
    try {
      
      
      const ProtectedDataAddress = await grantAccessFunc(
        data_address,
        farm_address,
        WEB3MAIL_APP_ENS,
        0
      );



      // Update the contacts state here

      let updatedFarmsCopy = [...grantedFarms];
      for (const item of updatedFarmsCopy) {
        if (Object.keys(item)[0] === record.address) {
          item[record.address].push(farmId);
        }
      }
      setGrantedFarms(updatedFarmsCopy);



    } catch (error) {
      notification.error({
        message: "Error",
        description: String(error),
      });
    }

    // Call the appropriate function or update state here
  };

  const expandedRowRender = (record, index, indent, expanded) => {
    

    return (
      <Table
        columns={farmColumns(record)}
        dataSource={farmsData}
        pagination={false}
      />
    );
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleAddContact}
        style={{ marginBottom: 16 }}
      >
        Add Contact
      </Button>
      <Table
        columns={address_columns}
        dataSource={contacts}
        expandedRowRender={expandedRowRender}
        rowKey="address"
      />
      <Modal
        title="Add Contact"
        visible={isAddContactModalVisible}
        onOk={handleAddContactSubmit}
        onCancel={() => setIsAddContactModalVisible(false)}
      >
        <Loading isLoading={loadingProtect}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Address Name"
              rules={[
                { required: true, message: "Please input the address name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input the email!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
    </>
  );
}
