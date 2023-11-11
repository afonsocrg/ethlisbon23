import { IExecWeb3mail } from '@iexec/web3mail';
import { getAccount } from '@wagmi/core';

//fetch my contacts by calling fetchMyContacts method from @iexec/web3mail
export const fetchMyContacts = async () => {
  try {
    const provider = await  getAccount().connector.options.getProvider();
    const web3mail = new IExecWeb3mail(provider);
    const contacts = await web3mail.fetchMyContacts();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};
export const sendMail = async (
  mailObject,
  mailContent,
  protectedData,
  contentType,
  senderName
) => {
  try {
    const account = getAccount();
    const provider = await account.connector?.getProvider();
    const web3mail = new IExecWeb3mail(provider);
    const txHash = await web3mail.sendEmail({
      emailSubject: mailObject,
      emailContent: mailContent,
      protectedData,
      contentType,
      senderName,
    });
    return txHash;
  } catch (error) {
    console.error('Error sending web3 mail:', error);
    throw error;
  }
};
