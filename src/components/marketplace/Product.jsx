import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";

const Product = ({address, product, buyProduct, deleteProduct}) => {
    const {name, image, description, link, price, neededprice, sold, appId, owner} =
        product;

    const [count, setCount] = useState(1)
    let passed = microAlgosToString(price) * sold;
    let pricepercent = Math.round((passed / microAlgosToString(neededprice))*100);
    console.log(passed);
    console.log(pricepercent)
    console.log(microAlgosToString(neededprice))
    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                    <Identicon size={28} address={owner}/>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Badge bg="secondary" className="ms-auto">
                            {sold} Donated
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    <Card.Link className="text-decoration-none pb-4 pt-2 fw-bold" href={link} target="_blank">View Proposal</Card.Link>
                    <Form className="d-flex align-content-stretch flex-row gap-2">
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
                                onChange={(e) => {
                                    setCount(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        <Button
                            variant="outline-dark"
                            disabled={microAlgosToString(price) * sold >= microAlgosToString(neededprice)}
                            onClick={() => buyProduct(product, count)}
                            className="w-75 py-3">
                                { (pricepercent >= 100) ? (<b>Reached Goal</b>) :(<span>Donate {microAlgosToString(price) * count} ALGO{microAlgosToString(price) > 1 ? 's' : ''}</span>) }
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
                    </Form>
                </Card.Body>
                <Card.Footer className="pb-1">
                <div className="progress">
                    <div className={"progress-bar" + (pricepercent === 100 ? ' bg-success': '')} role="progressbar" style={{ width: `${pricepercent}%` }} aria-valuenow={`${pricepercent}`} aria-valuemin="0" aria-valuemax={"100"}>{pricepercent}%</div>
                </div>
                <p className="w-100 text-center pt-4 pb-0">{passed} ALGOs gathered out of {neededprice/1000000} ALGOs</p>
                </Card.Footer>
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