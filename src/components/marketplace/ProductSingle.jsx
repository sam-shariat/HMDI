import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Badge, Button, Card, Row, Col, FloatingLabel, Form, Stack, Image } from "react-bootstrap";
import { microAlgosToString, truncateAddress } from "../../utils/conversions";
import Identicon from "../utils/Identicon";

const ProductSingle = ({ address, product, buyProduct, deleteProduct }) => {
    const { name, image, description, link, donation, goaldonation, donated, uwallets, appId, owner } =
        product;
    const [isMobile, setIsMobile] = useState(false)
    const [profile, setProfile] = useState(null)
    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 992) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    const shareIt = () => {
        navigator.share({
            title: name,
            text: description,
            url: `${process.env.REACT_APP_SITE_URL}?appId=${appId}`
        });
    }

    // create an event listener
    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })
    const [count, setCount] = useState(1)
    let passed = microAlgosToString(donation) * donated;
    let pricepercent = Math.round((passed / microAlgosToString(goaldonation)) * 100);
    return (
        <Row xs={1} sm={1} lg={2} className="g-1 mb-5 g-xl-2 g-xxl-2">
            <Col key={appId} xs={12} sm={12} lg={8}>
                <Card className="h-100 bg-dark">
                    <Image rounded src={image} alt={name} />
                    <Card.Body className="d-flex flex-column text-light">
                        <Card.Title>{name}</Card.Title>
                        <Card.Text className="flex-grow-1">{description}</Card.Text>
                        <Card.Link className="text-decoration-none pb-3 pt-3 fw-bold text-center w-100 border border-primary rounded" href={link} target="_blank">View Proposal</Card.Link>
                        <Card.Text className="d-flex align-items-center fs-8 mt-3">
                            {profile ?
                                <Image className="mx-2" width={28} height={28} src={profile.image} roundedCircle />
                                :
                                <Identicon address={owner} size={28} className="mx-2" />
                            }Added By <br />{truncateAddress(owner)}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col key={appId + "b"} xs={12} sm={12} lg={4}>
                <Card className="h-100 bg-dark">
                    <Card.Body className="d-flex flex-column text-light">
                        <p className="w-100 text-center fs-6 text-secondary"><b>{passed} ALGOs</b> raised of <b>{goaldonation / 1000000} Goal</b></p>

                        <div className="progress mb-2" style={{ backgroundColor: '#171717' }}>
                            <div className={"progress-bar" + (pricepercent === 100 ? ' bg-success' : '')} role="progressbar" style={{ width: `${pricepercent}%` }} aria-valuenow={pricepercent} aria-valuemin="0" aria-valuemax={"100"}>{pricepercent}%</div>
                        </div>


                        <p className="fs-6 mb-2">
                            {uwallets} Donations
                        </p>
                        <Form className="d-flex align-content-stretch flex-column gap-2 mb-2">
                            <Button
                                variant={'danger'}
                                onClick={shareIt}
                                className="w-100 py-3 bg-orange fs-5">
                                Share
                            </Button>
                            <Button
                                variant={(pricepercent === 100 ? 'success' : 'light')}
                                disabled={microAlgosToString(donation) * donated >= microAlgosToString(goaldonation)}
                                onClick={() => buyProduct(product, count)}
                                className="w-100 py-3 fs-5">
                                {(pricepercent >= 100) ? (<span>Goal Reached</span>) : (<span>Donate {microAlgosToString(donation) * count} ALGO{microAlgosToString(donation) > 1 ? 's' : ''}</span>)}
                            </Button>
                            <Form.Select
                                value={count}
                                className="py-3"
                                onChange={(e) => {
                                    setCount(Number(e.target.value));
                                }}
                            >
                                <option value="1">Want to help more ?</option>
                                <option value="2">2x</option>
                                <option value="4">4x</option>
                                <option value="6">6x</option>
                                <option value="6">8x</option>
                                <option value="10">10x</option>
                                <option value="15">15x</option>
                            </Form.Select>
                            {product.owner === address &&
                                <Button
                                    variant="outline-danger"
                                    onClick={() => deleteProduct(product)}
                                    className="btn"
                                >
                                    <i className="bi bi-trash"></i>
                                </Button>
                            }
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <p className="text-light">Top Donation</p>
                        <Stack direction="horizontal" gap={2}>
                            <Identicon size={28} address={owner} />
                            <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                            <Badge bg="secondary" className="ms-auto">
                                40 ALGOs
                            </Badge>
                        </Stack>
                    </Card.Footer>
                    <Card.Footer>
                        <p className="text-light">Last Donation</p>
                        <Stack direction="horizontal" gap={2}>
                            <Identicon size={28} address={owner} />
                            <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                            <Badge bg="secondary" className="ms-auto">
                                12 ALGOs
                            </Badge>
                        </Stack>
                    </Card.Footer>
                    <Card.Footer>
                        <a href={/*</Card.Footer>process.env.REACT_APP_SITE_URL+'/donations'*/'#'} className="text-light">See All Donations</a>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
};

ProductSingle.propTypes = {
    address: PropTypes.string.isRequired,
    product: PropTypes.instanceOf(Object).isRequired,
    buyProduct: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired
};

export default ProductSingle;