import React, { useEffect } from 'react';
import { Button, Typography, Space } from 'antd';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useConnect } from 'wagmi';

export default function Connect() {
  const { open } = useWeb3Modal();
  const { error } = useConnect();
  const { isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    console.log('isDisconnected', isDisconnected, open());
    if (isDisconnected) {
      open();
    }
  }, [isDisconnected, open]);

  return (
    <Space direction="vertical" size="middle" style={{ marginTop: 40 }}>
      {error && <Typography.Text type="danger">{error.message}</Typography.Text>}
      {isConnecting && <Typography.Text>Connecting…</Typography.Text>}
      {isDisconnected && (
        <Typography.Text type="secondary" italic>
          Connect your Wallet
        </Typography.Text>
      )}
    </Space>
  );
}
