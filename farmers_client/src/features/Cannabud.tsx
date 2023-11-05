import { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
  Link,
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { fetchMyContacts, sendMail } from './web3mail';
import {
  protectDataFunc,
  grantAccessFunc,
  revokeAccessFunc,
  fetchProtectedDataFunc,
} from './protectDataFunc';
import Connect from './Connect';
import { useAccount, useDisconnect } from 'wagmi';
import { IEXEC_EXPLORER_URL } from '../utils/config';
import { DataSchema, GrantedAccess } from '@iexec/dataprotector';
import { Contact } from '@iexec/web3mail';

import { shortAddress } from './utils';
import TruncatedText from './TruncatedText';

export default function Cannabud() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [events, setEvents] = useState<object[]>([]);

  const [selectedTab, setSelectedTab] = useState(0);

  const [loadingEmailAddresses, setLoadingEmailAddresses] = useState(false);
  const [authoritiesError, setAuthoritiesError] = useState<string | null>(null);
  const [authoritiesList, setAuthoritiesList] = useState<Contact[]>([]);

  const [emailSnakbarOpen, setEmailSnakbarOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthorityEmails()
  }, []);

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
  }

  const handleDisconnect = () => {
    disconnect();
  };

  const handleCreateEvent = (name, description) => {
    setUploadingEvent(true);
    const ts = new Date();
    const event = {
      name: name,
      description: description,
      created_at: ts,
    };
    protectDataFunc(event, 'Event')
      .then((protectedData) => {
        // console.log("protectedData", protectedData)
        event.protectedData = protectedData;
        setEvents([...events, event]);
        setUploadingEvent(false);
      })
      .catch((e) => {
        console.log('ERROR WHILE PROTECTING EVENT', e);
        setUploadingEvent(false);
      });
  };

  const handleSnackbarClose = () => {
    setEmailSnakbarOpen(false);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const handleSendMessage = async (protectedData: string) => {
    console.log('Sending email to ', protectedData);
    setEmailError(null);
    setSendingEmail(true);

    sendMail(
      'Report available',
      'Dear authority inspector, a new report is available on iExec App',
      protectedData,
      'text/plain',
      'Producer name',
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

  return (
    <Container disableGutters>
      {isConnected ? (
        <>
          <AppBar
            position="static"
            elevation={0}
            sx={{ backgroundColor: 'transparent', width: '100%' }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  flexGrow: 1,
                  textAlign: 'right',
                  mr: 2,
                  fontStyle: 'italic',
                  color: 'black',
                }}
              >
                <TruncatedText value={address as string} />
              </Typography>
              <Button variant="contained" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </Toolbar>
          </AppBar>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => {
              setSelectedTab(newValue);
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Event log" {...a11yProps(0)} />
            <Tab label="Notify Authorities" {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={selectedTab} index={0}>
            <div>
              <div>
                <Toolbar sx={{ justifyContent: 'center' }}>
                  <Button
                    sx={{ display: 'block', margin: '20px auto' }}
                    onClick={() =>
                      handleCreateEvent('Created Plant', 'Event description')
                    }
                    variant="contained"
                  >
                    Create plant
                  </Button>
                  <Button
                    sx={{ display: 'block', margin: '20px auto' }}
                    onClick={() =>
                      handleCreateEvent('Watered plant', 'Event description')
                    }
                    variant="contained"
                  >
                    Water plant
                  </Button>
                  <Button
                    sx={{ display: 'block', margin: '20px auto' }}
                    onClick={() =>
                      handleCreateEvent('Disposed plant', 'Event description')
                    }
                    variant="contained"
                  >
                    Dispose plant
                  </Button>
                  <Button
                    sx={{ display: 'block', margin: '20px auto' }}
                    onClick={() =>
                      handleCreateEvent('Harvested plant', 'Event description')
                    }
                    variant="contained"
                  >
                    Harvest plant
                  </Button>
                </Toolbar>
              </div>
              <Table
                sx={{
                  maxWidth: 800,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                aria-label="simple table"
              >
                <TableHead sx={{ border: 0, borderBottom: 'none' }}>
                  <TableRow sx={{ border: 0, borderBottom: 'none' }}>
                    <TableCell
                      sx={{
                        border: 0,
                        borderBottom: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Event name
                    </TableCell>
                    <TableCell
                      sx={{
                        border: 0,
                        borderBottom: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Creation Date
                    </TableCell>
                    <TableCell
                      sx={{
                        border: 0,
                        borderBottom: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Protected Address
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow
                      key={index}
                      sx={{ border: 0, borderBottom: 'none' }}
                    >
                      <TableCell component="th" scope="row">
                        {event.name}
                      </TableCell>
                      <TableCell align="left">
                        {event.created_at.toLocaleString()}
                      </TableCell>
                      <TableCell align="left">
                        <TruncatedText value={event.protectedData.address} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {events.length === 0 && (
                <span style={{ textAlign: 'center' }}>No data yet</span>
              )}
              {uploadingEvent && (
                <CircularProgress
                  sx={{ display: 'block', margin: '20px auto' }}
                ></CircularProgress>
              )}
              <Button
                sx={{ display: 'block', margin: '20px auto' }}
                onClick={() => setEvents([])}
                variant="contained"
              >
                Reset events
              </Button>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={selectedTab} index={1}>
            <div>
              <div>
                <Table
                  sx={{
                    maxWidth: 800,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  aria-label="simple table"
                >
                  <TableHead sx={{ border: 0, borderBottom: 'none' }}>
                    <TableRow sx={{ border: 0, borderBottom: 'none' }}>
                      <TableCell
                        sx={{
                          border: 0,
                          borderBottom: 'none',
                          fontWeight: 600,
                        }}
                      >
                        ETH Address
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          borderBottom: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {authoritiesList.map((contact, index) => (
                      <TableRow
                        key={index}
                        sx={{ border: 0, borderBottom: 'none' }}
                      >
                        <TableCell component="th" scope="row">
                          <TruncatedText value={contact.address} />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            className="ButtonSendM"
                            sx={{}}
                            onClick={() => handleSendMessage(contact.address)}
                            variant="contained"
                          >
                            Notify
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {loadingEmailAddresses ? (
                  <CircularProgress
                    sx={{ display: 'block', margin: '20px auto' }}
                  ></CircularProgress>
                ) : (
                  authoritiesList.length === 0 && (
                    <span style={{ textAlign: 'center' }}>No data yet</span>
                  )
                )}
                {authoritiesError && (
                  <Alert severity="error">{authoritiesError}</Alert>
                )}
                {emailError && <Alert severity="error">{emailError}</Alert>}
                {sendingEmail && <Alert severity="info">Sending email...</Alert>}
              </div>
            </div>
            <Snackbar
              open={emailSnakbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              message="Email sent successfully"
            />
          </CustomTabPanel>
        </>
      ) : (
        <Connect />
      )}
    </Container>
  );
}
