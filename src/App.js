import React, {useState} from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import {Container, Nav} from "react-bootstrap";
import Products from "./components/marketplace/Products";
import {Notification} from "./components/utils/Notifications";
import {indexerClient, myAlgoConnect} from "./utils/constants";
import coverImg from "./assets/img/balloon.svg"

const App = function AppWrapper() {

  const [address, setAddress] = useState(null);
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(0);

  const fetchBalance = async (accountAddress) => {
      indexerClient.lookupAccountByID(accountAddress).do()
          .then(response => {
              const _balance = response.account.amount;
              setBalance(_balance);
          })
          .catch(error => {
              console.log(error);
          });
  };

  const connectWallet = async () => {
      myAlgoConnect.connect()
          .then(accounts => {
              const _account = accounts[0];
              setAddress(_account.address);
              setName(_account.name);
              fetchBalance(_account.address);
          }).catch(error => {
          console.log('Could not connect to MyAlgo wallet');
          console.error(error);
      })
  };

  const disconnect = () => {
      setAddress(null);
      setName(null);
      setBalance(null);
  };
//..
return (
  <>
      <Notification />
      {address ? (
          <Container fluid="md">
              <Nav className="justify-content-between pt-3 pb-5">
                  <Nav.Item>
                      <h3 style={{cursor:'pointer'}}>HelpMeDoit</h3>
                  </Nav.Item>
                  <Nav.Item>
                      <Wallet
                          address={address}
                          name={name}
                          amount={balance}
                          disconnect={disconnect}
                          symbol={"ALGO"}
                      />
                  </Nav.Item>
              </Nav>
              <main>
                  <Products address={address} fetchBalance={fetchBalance}/>
              </main>
          </Container>
      ) : (
          <Cover name={"Help Me Do It"} sub={"A Decentralized Platform to Raise Funds ( in ALGOs ) For Your Most Important Project and Donate Some ALGO(s) To Help Your Fellows In Need"} coverImg={coverImg} connect={connectWallet}/>
      )}
  </>
);
}

export default App;