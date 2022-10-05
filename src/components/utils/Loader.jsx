import React from "react";
import {Spinner} from "react-bootstrap";
import PropTypes from "prop-types";

const Loader = ({height='400px'}) => (
    <div className="d-flex justify-content-center text-light align-items-center" style={{height:`${height}`}}>
        <Spinner animation="border" role="status" className="opacity-50">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
);

Loader.propTypes = {
    height: PropTypes.number,
};
export default Loader;