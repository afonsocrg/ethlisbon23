import { useState } from 'react';
import {
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Link,
  Box,
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
import TruncatedText from './TruncatedText';

export default function Front() {
  //web3mail dapp END
  const WEB3MAIL_APP_ENS = 'web3mail.apps.iexec.eth';
  //connection with wallet
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  //loading effect & error
  const [loadingProtect, setLoadingProtect] = useState(false);
  const [errorProtect, setErrorProtect] = useState('');
  const [loadingGrant, setLoadingGrant] = useState(false);
  const [errorGrant, setErrorGrant] = useState('');
  const [loadingRevoke, setLoadingRevoke] = useState(false);
  const [errorRevoke, setErrorRevoke] = useState('');
  const [loadingFetchProtected, setLoadingFetchProtected] = useState(false);
  const [errorFetchProtected, setErrorFetchProtected] = useState('');

  const [loadingEmailAddresses, setLoadingEmailAddresses] = useState(false);
  const [loadingSendingEmail, setLoadingSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  //global state
  const [protectedData, setProtectedData] = useState('');
  const [grantAccess, setGrantAccess] = useState<GrantedAccess>();
  const [revokeAccess, setRevokeAccess] = useState('');
  const [fetchedProtected, setFetchedProtected] = useState<object[]>([]);

  const [loadedEmailAddresses, setLoadedEmailAddresses] = useState<Contact[]>(
    []
  );

  const [ownerAddress, setOwnerAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  //set name
  const [name, setName] = useState('');

  //set email
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  //set access number
  const [accessNumber, setAccessNumber] = useState<number>(1);

  //set user restricted address
  const [authorizedUser, setAuthorizedUser] = useState('');

  //handle functions
  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setIsValidEmail(event.target.validity.valid);
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleProtectedDataChange = (event: any) => {
    setProtectedData(event.target.value);
  };

  const handleOwnerAddressChange = (event: any) => {
    setOwnerAddress(event.target.value);
  };

  const handleAccessNumberChange = (event: any) => {
    setAccessNumber(event.target.value);
  };

  const authorizedUserChange = (event: any) => {
    setAuthorizedUser(event.target.value);
  };

  //handle Submit
  const protectedDataSubmit = async () => {
    setErrorProtect('');
    if (email) {
      const data: DataSchema = { email: email } as DataSchema;
      try {
        setLoadingProtect(true);
        const { address } = await protectDataFunc(data, name);
        setProtectedData(address);
        setErrorProtect('');
      } catch (error) {
        setErrorProtect(String(error));
      }
      setLoadingProtect(false);
    } else {
      setErrorProtect('Please enter a valid email address');
    }
  };

  const grantAccessSubmit = async () => {
    setErrorGrant('');
    try {
      setAuthorizedUser(authorizedUser);
      setLoadingGrant(true);
      const accessHash = await grantAccessFunc(
        protectedData,
        authorizedUser,
        WEB3MAIL_APP_ENS,
        accessNumber
      );
      setErrorGrant('');
      setGrantAccess(accessHash);
    } catch (error) {
      setErrorGrant(String(error));
      setGrantAccess(undefined);
    }
    setLoadingGrant(false);
  };

  const revokeAccessSubmit = async () => {
    setRevokeAccess('');
    try {
      setLoadingRevoke(true);
      const tx = await revokeAccessFunc(
        protectedData,
        authorizedUser,
        WEB3MAIL_APP_ENS
      );
      setRevokeAccess(tx);
    } catch (error) {
      setErrorRevoke(String(error));
      setRevokeAccess('');
    }
    setLoadingRevoke(false);
  };
  const fetchProtectedDataSubmit = async () => {
    setFetchedProtected([]);
    try {
      setLoadingFetchProtected(true);
      const tx = await fetchProtectedDataFunc(ownerAddress);
      setFetchedProtected(tx);
    } catch (error) {
      setErrorRevoke(String(error));
      setFetchedProtected([]);
    }
    setLoadingFetchProtected(false);
  };

  //wallet address shortening
  const shortAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const handleLoadAddresses = async () => {
    try {
      setLoadingEmailAddresses(true);
      const res = await fetchMyContacts();
      setLoadedEmailAddresses(res);
      setLoadingEmailAddresses(false);
      // setdisplayTable(true);
    } catch (e) {
      setLoadingEmailAddresses(false);
    }
  };

  const handleSendMessage = async (protectedData: string) => {
    try {
      setLoadingSendingEmail(true);
      await sendMail(
        emailSubject,
        emailContent,
        protectedData,
        'text/plain',
        'iExec-sandbox'
      );
      setLoadingSendingEmail(false);
      setEmailSentSuccess(true);
    } catch (e) {
      setLoadingSendingEmail(false);
    }
  };

  return (
    <Container disableGutters>
      {isConnected ? (
        <>
          {/**App bar for wallet connection*/}
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
              <Button variant="contained" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </Toolbar>
          </AppBar>
          {/**First Box to create a Protected Data*/}
          <Box id="form-box">
            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
              Protect your data
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              variant="outlined"
              sx={{ mt: 3 }}
              value={email}
              onChange={handleEmailChange}
              type="email"
              error={!isValidEmail}
              helperText={!isValidEmail && 'Please enter a valid email address'}
            />
            <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
              sx={{ mt: 3 }}
            />
            {errorProtect && (
              <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                <Typography variant="h6"> Creation failed </Typography>
                {errorProtect}
              </Alert>
            )}
            {!loadingProtect && (
              <Button
                sx={{ display: 'block', margin: '20px auto' }}
                onClick={protectedDataSubmit}
                variant="contained"
              >
                Create
              </Button>
            )}
            {protectedData && !errorProtect && (
              <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                <Typography variant="h6">
                  Your data has been protected!
                </Typography>
                <Link
                  href={IEXEC_EXPLORER_URL + protectedData}
                  target="_blank"
                  sx={{ color: 'green', textDecorationColor: 'green' }}
                >
                  You can reach it here
                </Link>
                <p>Your protected data address: {protectedData}</p>
              </Alert>
            )}
            {loadingProtect && (
              <CircularProgress
                sx={{ display: 'block', margin: '20px auto' }}
              ></CircularProgress>
            )}
          </Box>
          {/**Second Box to grant access to a Protected Data */}
          {protectedData && (
            <Box id="form-box">
              <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
                Grant Access for your protected data
              </Typography>
              <TextField
                required
                fullWidth
                label="Data Address"
                variant="outlined"
                sx={{ mt: 3 }}
                value={protectedData}
                onChange={handleProtectedDataChange}
                type="text"
              />
              <TextField
                fullWidth
                type="number"
                id="age"
                label="Access Number"
                variant="outlined"
                value={accessNumber}
                InputProps={{ inputProps: { min: 1 } }}
                onChange={handleAccessNumberChange}
                sx={{ mt: 3 }}
              />
              <TextField
                fullWidth
                id="authorizedUser"
                label="User Address Restricted"
                variant="outlined"
                sx={{ mt: 3 }}
                value={authorizedUser}
                onChange={authorizedUserChange}
                type="text"
              />
              {!loadingGrant && (
                <Button
                  id="spacingStyle"
                  onClick={grantAccessSubmit}
                  variant="contained"
                >
                  Grant Access
                </Button>
              )}
              {errorGrant && (
                <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                  <Typography variant="h6"> Grant Access failed </Typography>
                  {errorGrant}
                </Alert>
              )}
              {grantAccess && !errorGrant && (
                <>
                  <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                    <Typography variant="h6">
                      Your access has been granted !
                    </Typography>
                  </Alert>
                </>
              )}
              {loadingGrant && (
                <CircularProgress id="spacingStyle"></CircularProgress>
              )}
            </Box>
          )}
          {/**Third Box to revoke the access given to a Protected Data*/}
          {grantAccess && (
            <Box id="form-box">
              <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
                Revoke Access For Your data
              </Typography>
              <TextField
                required
                fullWidth
                id="dataorderAddresssetAddress"
                label="Data Address"
                variant="outlined"
                sx={{ mt: 3 }}
                value={protectedData}
                onChange={handleProtectedDataChange}
                type="text"
              />
              {!loadingRevoke && (
                <Button
                  id="spacingStyle"
                  onClick={revokeAccessSubmit}
                  variant="contained"
                >
                  Revoke Access
                </Button>
              )}
              {loadingRevoke && (
                <CircularProgress id="spacingStyle"></CircularProgress>
              )}
              {revokeAccess && !errorRevoke && (
                <>
                  <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                    <Typography variant="h6">
                      You have successfully revoked access!
                    </Typography>
                  </Alert>
                </>
              )}
              {errorRevoke && (
                <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                  <Typography variant="h6"> Revoke Access failed </Typography>
                  {errorRevoke}
                </Alert>
              )}
            </Box>
          )}
          {
            <Box id="form-box">
              <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
                Fetch Protected Data
              </Typography>
              <TextField
                required
                fullWidth
                id="ownerAddress"
                label="Owner Address"
                variant="outlined"
                sx={{ mt: 3 }}
                value={ownerAddress}
                onChange={handleOwnerAddressChange}
                type="text"
              />
              {!loadingFetchProtected && (
                <Button
                  id="spacingStyle"
                  onClick={fetchProtectedDataSubmit}
                  variant="contained"
                >
                  Fetch Protected Data
                </Button>
              )}
              {loadingFetchProtected && (
                <CircularProgress id="spacingStyle"></CircularProgress>
              )}
              {fetchedProtected && !errorFetchProtected && (
                <>
                  <Alert sx={{ mt: 3, mb: 2 }} severity="success">
                    <Typography variant="h6">
                      You have successfully fetched the data
                    </Typography>
                  </Alert>
                </>
              )}
              {errorFetchProtected && (
                <Alert sx={{ mt: 3, mb: 2 }} severity="error">
                  <Typography variant="h6">
                    {' '}
                    Fetch protected data failed{' '}
                  </Typography>
                  {errorFetchProtected}
                </Alert>
              )}
              {fetchedProtected && (
                <>
                  <h5>Data:</h5>
                  <ol>
                    {fetchedProtected.map((item: any, index: number) => (
                      <li key={index}>{JSON.stringify(item)}</li>
                    ))}
                  </ol>
                </>
              )}
            </Box>
          }
          {
            <Box className="my-box">
              <Button
                sx={{ display: 'block', margin: '20px auto' }}
                onClick={handleLoadAddresses}
                variant="contained"
              >
                Load authorized addresses
              </Button>
              {loadingEmailAddresses && (
                <CircularProgress
                  sx={{ display: 'block', margin: '20px auto' }}
                ></CircularProgress>
              )}
              {!loadingEmailAddresses && (
                <>
                  <p>{JSON.stringify(loadedEmailAddresses)}</p>
                  <div>
                    <Table
                      sx={{
                        maxWidth: 200,
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
                        {loadedEmailAddresses.map((contact, index) => (
                          <TableRow
                            key={index}
                            sx={{ border: 0, borderBottom: 'none' }}
                          >
                            <TableCell component="th" scope="row">
                              {shortAddress(contact.address)}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                className="ButtonSendM"
                                sx={{}}
                                onClick={() => handleSendMessage(contact.address)}
                                variant="contained"
                              >
                                Send Message
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              <TextField
                required
                fullWidth
                id="email-subject"
                label="Email Subject"
                variant="outlined"
                sx={{ mt: 3 }}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <TextField
                required
                fullWidth
                id="email-content"
                label="Email Content"
                variant="outlined"
                sx={{ mt: 9 }}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </Box>
          }
        </>
      ) : (
        <Connect />
      )}
    </Container>
  );
}
