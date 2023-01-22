import React from "react";
import {Spinner} from "react-bootstrap";
import PropTypes from "prop-types";

const Loader = ({height='400px',text='Loading...',mode='light'}) => (
    <div className={"d-flex justify-content-center text-"+mode+" align-items-center"} style={{height:`${height}`}}>
        <Spinner animation="border" role="status" className="opacity-50">
            <span className="visually-hidden">{text}</span>
        </Spinner>
        <span className="px-2">{text}</span>
    </div>
);

Loader.propTypes = {
    height: PropTypes.number,
    text: PropTypes.string,
    mode: PropTypes.string,
};
export default Loader;