import React, {useState} from "react";
import PropTypes from "prop-types";
import {Card, Col} from "react-bootstrap";
import {microAlgosToString} from "../../utils/conversions";
import getIPFS from "../../utils/getIPFS";

const Product = ({address, product, buyProduct, deleteProduct}) => {
    const {name, image, description, link, donation, goaldonation, donated, uwallets, appId, owner} =
        product;

    let passed = microAlgosToString(donation) * donated;
    let pricepercent = Math.round((passed / microAlgosToString(goaldonation))*100);

    return (
        <Col key={appId}>
            <Card className="h-100 bg-dark">
                
                <div className="ratio ratio-16x9">
                    <img src={getIPFS(image)} alt={name} style={{objectFit: "cover"}}/>
                </div>
                
                <Card.Body className="d-flex flex-column text-light">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
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