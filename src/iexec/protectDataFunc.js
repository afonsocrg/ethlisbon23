import { getAccount } from '@wagmi/core';
import { IExecDataProtector, DataSchema } from '@iexec/dataprotector';


const getDataProtector = async () => {
  let result = getAccount();
  // const provider = await result.connector?.getProvider();
  if (!result.connector) {
    // wait for connector to exist

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        result = getAccount();
        if (result.connector) {
          clearInterval(interval);
          resolve(true);
        }
      }, 1000);
    }
    );
  }
  const provider = await  result.connector.options.getProvider();

  const dataProtector = new IExecDataProtector(provider);
  return dataProtector;
}

//protect data by calling protectData method from @iexec/dataprotector
const protectDataFunc = async (data, name) => {
  const dataProtector = await getDataProtector();

  const { address } = await dataProtector.protectData({
    data,
    name,
  });
  return address;
};

//revoke access by calling revokeOneAccess method from @iexec/dataprotector
const revokeAccessFunc = async (
  protectedData,
  authorizedUser,
  authorizedApp
) => {
  const dataProtector = await getDataProtector();

  const grantedAccessArray = await dataProtector.fetchGrantedAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
  });
  const { txHash } = await dataProtector.revokeOneAccess(grantedAccessArray[0]);

  return txHash;
};

//grant access by calling grantAccess method from @iexec/dataprotector
const grantAccessFunc = async (
  protectedData,
  authorizedUser,
  authorizedApp,
  pricePerAccess
) => {
  const dataProtector = await getDataProtector();

  const accessHash = await dataProtector.grantAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
    pricePerAccess,
    numberOfAccess: 10000,
  });
  return accessHash;
};

const fetchGrantedAccess = async (protectedData, authorizedUser) => {
  const dataProtector = await getDataProtector();
  const grantedAccessArray = await dataProtector.fetchGrantedAccess({ protectedData: protectedData, authorizedUser: authorizedUser });
  return grantedAccessArray;
}

const fetchProtectedDataFunc = async (owner) => {
  const dataProtector = await getDataProtector();
  const data = await dataProtector.fetchProtectedData({ owner });
  return data;
}

export { protectDataFunc, revokeAccessFunc, grantAccessFunc, fetchProtectedDataFunc, fetchGrantedAccess };
