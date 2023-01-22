import React, { useState, useEffect } from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import { Button, Container, Nav } from "react-bootstrap";
import Products from "./pages/Products";
import { Notification } from "./components/utils/Notifications";
import { indexerClient, myAlgoConnect } from "./utils/constants";
import coverImg from "./assets/img/balloon.svg"
import SingleProduct from "./pages/SingleProduct";
import { ReactSVG } from 'react-svg'

const App = function AppWrapper() {

    const [address, setAddress] = useState(localStorage.getItem('algo_wallet_address'));
    const [name, setName] = useState(localStorage.getItem('algo_wallet_name'));
    const [balance, setBalance] = useState(0);
    const queryParams = new URLSearchParams(window.location.search);
    const appId = queryParams.get('appId');
    const user = queryParams.get('user');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 767 ? true : false)
    const handleResize = () => {
        if (window.innerWidth < 767) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }
    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })
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

    if (address && Number(address) !== 0) {
        fetchBalance(address);
    }

    const connectWallet = async () => {
        myAlgoConnect.connect()
            .then(accounts => {
                const _account = accounts[0];
                setAddress(_account.address);
                localStorage.setItem('algo_wallet_address', _account.address)
                setName(_account.name);
                localStorage.setItem('algo_wallet_name', _account.name)
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
        localStorage.setItem('algo_wallet_name', 0);
        localStorage.setItem('algo_wallet_address', 0);
    };
    //..
    return (
        <>
            <Notification />
            {address && Number(address) !== 0 ? (
                <Container fluid className="m-0 p-0">
                    <Container fluid="md">
                        <Nav className="justify-content-between pt-3">
                            <Nav.Item>
                                <Nav.Link href="/" className="p-0 m-0 py-1">
                                    <h3 style={{ cursor: 'pointer' }}
                                        className="fw-bold d-flex m-0">
                                        <ReactSVG src={coverImg} />{isMobile ? 'HMDI' : 'HelpMeDoit'}</h3>
                                </Nav.Link>
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
                    </Container>
                    <main>
                        {appId ? <SingleProduct address={address} fetchBalance={fetchBalance} /> : <Products address={address} fetchBalance={fetchBalance} />}
                    </main>
                </Container>
            ) : (
                <Cover name={"Help Me Do It"} title={<span><b className="cover-title">Your Home<br />For Help </b>🙏</span>} sub={"A Decentralized Platform to Raise Funds For Your Most Important Project(s) and Donate Some ALGO(s) To Help Your Fellows In Need"} coverImg={coverImg} connect={connectWallet} />
            )}
        </>
    );
}

export default App;