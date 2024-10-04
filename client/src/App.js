import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json";
import "./App.css";

function App() {
  const [message, setMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false)

  const [owner, setOwner] = useState(null);
  const [newOwner, setNewOwner] = useState("");

  //address
  const contractAddress = "0xCD308B997377c391F1EfE3A637062D42FA835a4B";

  // async function for accessing metamask in our browser
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    setConnected(true)
  }

  //getMessage function using ethers
  async function getMessage() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const getMsg = await contract.getMessage();
        setMessage(getMsg);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  const handleSubmit = async () => {
    await updateMessage(newMessage);

    await getMessage();

    setNewMessage("");
  };

  //set message function using ethers
  async function updateMessage(data) {
    if (typeof window.ethereum !== "undefined") {
      // await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        await contract.setMessage(data);
        const getMsg = await contract.getMessage();
        setMessage(getMsg);
        await getMessage();
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  // methods for ownership transfer
  async function getCurrentOwner() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const currtOwner = await contract.owner();
        setOwner(currtOwner);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  const handleOwnershipTransfer = async () => {
    await updateOwner(newOwner);

    setNewOwner("");
  };

  async function updateOwner(data) {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      try {
        const tx = await contract.transferOwnership(data);
        tx.wait();
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      await requestAccount();
    }
  }

  return (
    <div className="App">
      <button onClick={requestAccount}> {connected ? "Connected" : "Connect Wallet"} </button>
      <h1>Message Retrieval DApp</h1>

      <form>
        <h2>
          <span>Message:</span> {message}
        </h2>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new message"
        />
        <div className="btns">
          <button type="button" onClick={getMessage}>
            Get New Message
          </button>
          <button type="button" onClick={handleSubmit}>
            Set Message
          </button>
        </div>
      </form>

      {/* Ownership Transfer */}
      <form>
        <h2>
          Current Owner:
          <span>{owner}</span>
        </h2>
        <input
          type="text"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          placeholder="Enter address"
        />
        <div className="btns">
          <button type="button" onClick={getCurrentOwner}>
            Get Owner
          </button>
          <button type="button" onClick={handleOwnershipTransfer}>
            Transfer Ownership
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
