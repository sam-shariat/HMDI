import React from 'react';
import { Button, Col, Container, Nav, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg'
import Copyright from './Copyright';
import InteractiveLogo from './InteractiveLogo';

const Cover = ({ name, title, sub, coverImg, connect }) => {
    return (
        <Container><Nav className="justify-content-between pt-3 px-3">
        <Nav.Item>
            <h2 style={{cursor:'pointer',fontWeight:'bold',display:'flex'}}><ReactSVG src={coverImg} />HMDI</h2>
            
        </Nav.Item>
        <Nav.Item>
            <Button
                    onClick={() => connect()}
                    variant="light"
                    className="rounded rounded-pill px-3 py-2">
                    Connect Wallet
                </Button>
        </Nav.Item>
    </Nav>
        <main className="d-flex flex-column justify-content-center align-items-center desktop-vh-100 mobile-block">
            <Row xs={1} sm={1} md={2} lg={2} className="text-light mobile-pt-1">
                <Col xs={12} sm={12} md={6} lg={6} className="d-flex flex-column justify-content-center align-items-center">
                <span className="pt-5 mt-5" />
                <InteractiveLogo />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="mobile-center">
                <div className='pt-2 mobile-pt-1 mobile-center'>
                    <div className='w-75'>
                        <h1 className='fs-3 fw-bold'>{name}</h1>
                        <p className='fs-5 cover-sub'>{sub}</p>
                    </div>
                </div>
                <p>Please Login with your wallet to Get Started.</p>
                <Button
                    onClick={() => connect()}
                    variant="dark"
                    className="rounded px-5 py-2 mt-1">
                    Get Started
                </Button>
                </Col>
            </Row>
            <Copyright />
        </main>
        </Container>
    );
};

Cover.propTypes = {
    name: PropTypes.string,
    coverImg: PropTypes.string,
    connect: PropTypes.func
};

export default Cover;