import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';  // Updated styling with blue, black, and light black theme

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Check if MetaMask is installed and available
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);

      // Request wallet connection
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          loadAccountData(web3Instance, accounts[0]);
        })
        .catch((err) => console.error("User denied wallet connection:", err));
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  // Load the account balance
  const loadAccountData = async (web3Instance, account) => {
    const balance = await web3Instance.eth.getBalance(account);
    setBalance(web3Instance.utils.fromWei(balance, 'ether'));
  };

  // Transfer Ether to another account
  const transferEth = async () => {
    if (web3 && recipient && amount) {
      const weiAmount = web3.utils.toWei(amount, 'ether');
      try {
        await web3.eth.sendTransaction({
          from: account,
          to: recipient,
          value: weiAmount
        });
        alert('Transfer Successful!');
      } catch (err) {
        alert(`Transfer Failed: ${err.message}`);
      }
    } else {
      alert("Please fill out both fields!");
    }
  };

  return (
    <div className="premium-wallet">
      <div className="wallet-card shadow-lg p-5">
        <h2 className="wallet-title text-center mb-5">Crypto Wallet</h2>

        <div className="wallet-info mb-">
          <div className="mb-3">
            <label className="label"><strong>Account:</strong></label>
            <p className="wallet-text">{account || 'Not Connected'}</p>
          </div>

          <div className="">
            <label className="label"><strong>Balance:</strong></label>
            <p className="wallet-text">{balance} ETH</p>
          </div>
        </div>

        <div className="transfer-section shadow-sm p-4">
          <h4 style={{color:'white', }}>Transfer ETH</h4>
          <div className="mb-3">
            <label className="label"><strong>Recipient Address:</strong></label>
            <input 
              type="text" 
              className="form-control input-style" 
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="label"><strong>Amount (ETH):</strong></label>
            <input 
              type="number" 
              className="form-control input-style" 
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="btn btn-blue-black btn-block btn-rounded" onClick={transferEth}>Send ETH</button>
        </div>
      </div>
    </div>
  );
}

export default App;
