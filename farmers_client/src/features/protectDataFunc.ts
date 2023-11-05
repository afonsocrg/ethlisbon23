import { getAccount } from '@wagmi/core';
import { IExecDataProtector, DataSchema } from '@iexec/dataprotector';


const getDataProtector = async () => {
  const result = getAccount();
  const provider = await result.connector?.getProvider();

  const dataProtector = new IExecDataProtector(provider);
  return dataProtector;
}

//protect data by calling protectData method from @iexec/dataprotector
const protectDataFunc = async (data: object, name: string) => {
  const dataProtector = await getDataProtector();

  const protectedData = await dataProtector.protectData({
    data,
    name,
  });
  return protectedData;
};

//revoke access by calling revokeOneAccess method from @iexec/dataprotector
const revokeAccessFunc = async (
  protectedData: string,
  authorizedUser: string,
  authorizedApp: string
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
  protectedData: string,
  authorizedUser: string,
  authorizedApp: string,
  numberOfAccess: number
) => {
  const dataProtector = await getDataProtector();

  const accessHash = await dataProtector.grantAccess({
    protectedData,
    authorizedUser,
    authorizedApp,
    numberOfAccess,
    pricePerAccess: 0,
  });
  return accessHash;
};

const fetchProtectedDataFunc = async (owner: string) => {
  const dataProtector = await getDataProtector();
  const data = await dataProtector.fetchProtectedData({ owner });
  return data;
}

export { protectDataFunc, revokeAccessFunc, grantAccessFunc, fetchProtectedDataFunc };
