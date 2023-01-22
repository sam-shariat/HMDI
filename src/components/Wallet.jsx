import React, { useEffect, useState } from "react";
import { Dropdown, Spinner, Stack, Image } from 'react-bootstrap';
import { microAlgosToString, truncateAddress } from '../utils/conversions';
import Identicon from './utils/Identicon'
import PropTypes from "prop-types";
import AddProfile from './marketplace/AddProfile';
import { createProfileAction, editProfileAction, getProfileAction } from '../utils/profile';
import { toast } from "react-toastify";
import { NotificationError, NotificationSuccess } from "../components/utils/Notifications";
import { createProductAction } from "../utils/marketplace";
import AddProduct from "./marketplace/AddProduct";

const Wallet = ({ address, name, amount, symbol, disconnect }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
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

    const getProfile = async () => {
        setLoading(true);
        getProfileAction(address)
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

    const createProduct = async (data) => {
        setLoading(true);
        createProductAction(address, data)
            .then((tx) => {
                toast(<NotificationSuccess text="Project added successfully." tx_id={tx[1]} />);
                //fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to create a project." />);
                setLoading(false);
            })
    };

    const createProfile = async (data) => {
        setLoading(true);
        createProfileAction(address, data)
            .then((tx) => {
                toast(<NotificationSuccess text="Profile added successfully." tx_id={tx[1]} />);
                getProfile();
                //fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to create a Profile." />);
                setLoading(false);
            })
    };

    const editProfile = async (data) => {
        setLoading(true);
        editProfileAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Profile Updated" />);
                getProfile();
                //fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to Update Profile. Please Try Again" />);
                setLoading(false);
            })
    };
    return (
        <div className="d-flex">
            <AddProduct createProduct={createProduct} className="mx-2 rounded-pill px-2" label={<h3 className="m-0"><i className="bi bi-plus"></i></h3>} />
            <Dropdown>
                <Dropdown.Toggle variant="dark" align="end" id="dropdown-basic"
                    className="d-flex align-items-center rounded-pill py-2 px-3">
                    {amount ? (
                        <>
                            {microAlgosToString(amount, isMobile ? 0 : 3)}
                            <span className="ms-1"> {symbol}</span>
                        </>
                    ) : (
                        <Spinner animation="border" size="sm" className="opacity-25" />
                    )}
                    {profile ?
                        <Image className="mx-2" width={28} height={28} src={profile.image} roundedCircle />
                        :
                        <Identicon address={address} size={28} className="ms-2 me-1" />
                    }
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0">
                    <Dropdown.Item href={`http://localhost:3000?address=${address}`}
                        target="_blank">
                        <Stack direction="horizontal" gap={2}>
                            <i className="bi bi-person-circle fs-4" />
                            <div className="d-flex flex-column">
                                {!loading && profile ? <span className="font-monospace fw-bold">{profile.name}</span> : name && (<span className="font-monospace">{name}</span>)}
                                <span className="font-monospace">{truncateAddress(address)}</span>
                            </div>

                        </Stack>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <AddProfile createProfile={createProfile} editProfile={editProfile} address={address} />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as="button" className="d-flex align-items-center" onClick={() => {
                        disconnect();
                    }}>
                        <i className="bi bi-box-arrow-right me-2 fs-4" />
                        Disconnect
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
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