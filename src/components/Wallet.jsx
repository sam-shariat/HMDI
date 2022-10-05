import React, {useEffect, useState} from "react";
import {Dropdown, Spinner, Stack} from 'react-bootstrap';
import {microAlgosToString, truncateAddress} from '../utils/conversions';
import Identicon from './utils/Identicon'
import PropTypes from "prop-types";
import AddProfile from './marketplace/AddProfile';
import { createProfileAction, editProfileAction, getProfileAction } from '../utils/profile';
import {toast} from "react-toastify";
import {NotificationError, NotificationSuccess} from "../components/utils/Notifications";

const Wallet = ({address, name, amount, symbol, disconnect}) => {
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getProfile = async () => {
        setLoading(true);
        getProfileAction()
            .then(profiles => {
                if (profiles.length > 0) {
                    setProfile(profiles[0]);
					console.log(profiles[0]);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getProfile();
    }, []);
    if (!address) {
        return null;
    }
    const createProfile = async (data) => {
	    setLoading(true);
	    createProfileAction(address, data)
	        .then(() => {
	            toast(<NotificationSuccess text="Profile added successfully."/>);
	            getProfile();
	            //fetchBalance(address);
	        })
	        .catch(error => {
	            console.log(error);
	            toast(<NotificationError text="Failed to create a Profile."/>);
	            setLoading(false);
	        })
	};

    const editProfile = async (data) => {
	    setLoading(true);
	    editProfileAction(address, data)
	        .then(() => {
	            toast(<NotificationSuccess text="Profile Updated"/>);
	            getProfile();
	            //fetchBalance(address);
	        })
	        .catch(error => {
	            console.log(error)
	            toast(<NotificationError text="Failed to Update Profile. Please Try Again"/>);
	            setLoading(false);
	        })
	};
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="dark" align="end" id="dropdown-basic"
                                 className="d-flex align-items-center border rounded-pill py-2 px-3">
                    {amount ? (
                        <>
                            {microAlgosToString(amount)}
                            <span className="ms-1"> {symbol}</span>
                        </>
                    ) : (
                        <Spinner animation="border" size="sm" className="opacity-25"/>
                    )}
                    <Identicon address={address} size={28} className="ms-2 me-1"/>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0">
                    <Dropdown.Item href={`https://testnet.algoexplorer.io/address/${address}`}
                                   target="_blank">
                        <Stack direction="horizontal" gap={2}>
                            <i className="bi bi-person-circle fs-4"/>
                            <div className="d-flex flex-column">
                                {name && (<span className="font-monospace">{name}</span>)}
                                <span className="font-monospace">{truncateAddress(address)}</span>
                            </div>
                        </Stack>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <AddProfile createProfile={createProfile} />
                    </Dropdown.Item>
                    <Dropdown.Divider/>
                    <Dropdown.Item as="button" className="d-flex align-items-center" onClick={() => {
                        disconnect();
                    }}>
                        <i className="bi bi-box-arrow-right me-2 fs-4"/>
                        Disconnect
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
};

Wallet.propTypes = {
    address: PropTypes.string,
    name: PropTypes.string,
    amount: PropTypes.number,
    symbol: PropTypes.string,
    disconnect: PropTypes.func
};

export default Wallet;