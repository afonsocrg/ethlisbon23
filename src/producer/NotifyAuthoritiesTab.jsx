import { useState, useEffect } from 'react';
import { Button, Table, Alert, message } from 'antd';
import TruncatedText from '../components/TruncatedText';
import { fetchMyContacts, sendMail } from '../iexec/web3mail';

export default function NotifyAuthoritiesTab() {
  const [authoritiesList, setAuthoritiesList] = useState([]);

  const [loadingEmailAddresses, setLoadingEmailAddresses] = useState(false);

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSnakbarOpen, setEmailSnakbarOpen] = useState(false);
  const [authoritiesError, setAuthoritiesError] = useState(null);

  useEffect(() => {
    fetchAuthorityEmails();
  }, []);

  useEffect(() => {
    showEmailSuccessMessage();
  }, [emailSnakbarOpen]);

  const handleSnackbarClose = () => {
    setEmailSnakbarOpen(false);
  };

  const showEmailSuccessMessage = () => {
    if (emailSnakbarOpen) {
      message.success('Email sent successfully', 6); // Duration is 6 seconds
      handleSnackbarClose(); // Resets or handles the state after showing the message
    }
  };

  const fetchAuthorityEmails = async () => {
    setAuthoritiesError(null);
    setLoadingEmailAddresses(true);
    fetchMyContacts()
      .then((contacts) => {
        setAuthoritiesList(contacts);
        setLoadingEmailAddresses(false);
      })
      .catch((e) => {
        console.log('ERROR FETCHING AUTHORITY EMAILS', e);
        setLoadingEmailAddresses(false);
        setAuthoritiesError(e.message);
      });
  };

  const handleSendMessage = async (protectedData) => {
    console.log('Sending email to ', protectedData);
    setEmailError(null);
    setSendingEmail(true);

    sendMail(
      'Report available',
      'Dear authority inspector, a new report is available on iExec App',
      protectedData,
      'text/plain',
      'Producer name'
    )
      .then((res) => {
        console.log('Email sent', res);
        fetchAuthorityEmails();
        setEmailSnakbarOpen(true);
        setSendingEmail(false);
      })
      .catch((e) => {
        console.error('Error sending email', e);
        setEmailError(e.message);
        setSendingEmail(false);
      });
  };

  const authorityColumns = [
    {
      title: 'ETH Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => <TruncatedText value={address} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleSendMessage(record.address)}
        >
          Notify
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div>
        <Table
          columns={authorityColumns}
          dataSource={authoritiesList}
          pagination={false}
          loading={loadingEmailAddresses}
          locale={{
            emptyText: <div style={{ textAlign: 'center' }}>No data yet</div>,
          }}
        />
        {authoritiesError && <Alert message={authoritiesError} type="error" />}
        {emailError && <Alert message={emailError} type="error" />}
        {sendingEmail && <Alert message="Sending email..." type="info" />}
      </div>
    </div>
  );
}
