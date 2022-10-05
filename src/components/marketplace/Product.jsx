import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";

const Product = ({address, product, buyProduct, deleteProduct}) => {
    const {name, image, description, link, donation, goaldonation, donated, uwallets, appId, owner} =
        product;

    const [count, setCount] = useState(1)
    let passed = microAlgosToString(donation) * donated;
    let pricepercent = Math.round((passed / microAlgosToString(goaldonation))*100);

    return (
        <Col key={appId}>
            <Card className="h-100 bg-dark">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                    <Identicon size={28} address={owner}/>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Badge bg="secondary" className="ms-auto">
                            {uwallets} Donations
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-16x9">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-light">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    {/* <Form className="d-flex align-content-stretch flex-row gap-2 mt-2">
                        <FloatingLabel
                            controlId="inputCount"
                            label="Count"
                            className="w-25"
                        >
                            <Form.Control
                                type="number"
                                value={count}
                                min="1"
                                max="10"
                                required
                                className="bg-dark text-light"
                                onChange={(e) => {
                                    setCount(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        <Button
                            variant={(pricepercent === 100 ? 'success': 'light')}
                            disabled={microAlgosToString(price) * sold >= microAlgosToString(neededprice)}
                            onClick={() => buyProduct(product, count)}
                            className="w-75 py-3">
                                { (pricepercent >= 100) ? (<b>Goal Reached</b>) :(<b>Donate {microAlgosToString(price) * count} ALGO{microAlgosToString(price) > 1 ? 's' : ''}</b>) }
                        </Button>
                        {product.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deleteProduct(product)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }
                    </Form> */}
                    <div className="progress" style={{backgroundColor:'#171717'}}>
                        <div className={"progress-bar" + (pricepercent === 100 ? ' bg-success': '')} role="progressbar" style={{ width: `${pricepercent}%` }} aria-valuenow={pricepercent} aria-valuemin="0" aria-valuemax={"100"}>{pricepercent}%</div>
                    </div>
                <p className="w-100 text-center pt-4 pb-0 fs-7 text-secondary"><b>{passed} ALGOs</b> raised of <b>{goaldonation/1000000} Goal</b></p>
                <Card.Link className={"text-decoration-none pb-3 pt-3 fw-bold text-center text-light w-100 rounded bg-"+(pricepercent === 100 ? 'success': 'primary')} href={'?appId='+appId} >{ (pricepercent >= 100) ? (<b>Goal Reached</b>) :(<b>Fund Project</b>) }</Card.Link>
                </Card.Body>
                
            </Card>
        </Col>
    );
};

Product.propTypes = {
    address: PropTypes.string.isRequired,
    product: PropTypes.instanceOf(Object).isRequired,
    buyProduct: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired
};

export default Product;