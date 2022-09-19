import React from 'react';
import {Button} from "react-bootstrap";
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg'

const Cover = ({name, sub, coverImg, connect}) => {
    return (
        <div className="d-flex justify-content-center flex-column text-center bg-black bg-gradient min-vh-100">
            <div className="mt-auto text-light mb-5">
            <div style={{height:50}} className="mb-5"><ReactSVG src={coverImg}style={{height:50}} /></div>
            <div className='pt-2 d-flex justify-content-center align-items-center flex-column text-center'>
                <div className='w-75'>
                <h1>{name}</h1>
                <p className='fs-4'>{sub}</p>
                </div>
                </div>
                <p>Please connect your wallet to continue.</p>
                <Button
                    onClick={() => connect()}
                    variant="outline-light"
                    className="rounded-pill px-4 py-2 mt-3"
                >
                    Connect Wallet
                </Button>
            </div>
            <p className="mt-auto text-secondary">Powered by Algorand</p>
        </div>
    );
};

Cover.propTypes = {
    name: PropTypes.string,
    coverImg: PropTypes.string,
    connect: PropTypes.func
};

export default Cover;