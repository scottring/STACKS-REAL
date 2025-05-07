import React, { useState } from 'react';
import './App.css';
import { UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

// Configure Stacks network - Change to StacksMainnet() for production
const network = new StacksTestnet();

// Configure app manifest for authentication
const appConfig = {
  appName: 'Stacks Real',
  appIconUrl: '/logo192.png',
  network,
};

// Create a new UserSession with the app config
const userSession = new UserSession({ appConfig });

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Check if user is already authenticated
  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserData(userData);
      setAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  // Handle authentication with Stacks wallet
  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Stacks Real',
        icon: window.location.origin + '/logo192.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
        setAddress(userData.profile.stxAddress.testnet);
      },
      userSession,
    });
  };

  // Handle user sign out
  const disconnect = () => {
    userSession.signUserOut('/');
    setAddress(null);
    setUserData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>STACKS-REAL</h1>
        <p>A decentralized application built on the Stacks blockchain</p>
        
        {address ? (
          <div className="wallet-info">
            <p>Connected: {address}</p>
            <button className="disconnect-button" onClick={disconnect}>Disconnect Wallet</button>
            <div className="account-details">
              <h2>Account Details</h2>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <button className="connect-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
