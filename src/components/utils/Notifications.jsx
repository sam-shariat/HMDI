import React from "react";
import { ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import { algoExpTest } from "../../utils/constants";
import { Button } from "react-bootstrap";

const Notification = () => (
    <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
    />
);

const NotificationSuccess = ({ text, tx_id, type ='tx'}) => (
    <div className="d-flex">
        <i className="bi bi-check-circle-fill text-success mx-2" />
        <span className="text-secondary mx-1">{text}</span>
        <Button
            href={algoExpTest+type+"/"+tx_id}
            target="_blank"
            variant="dark"
            className="rounded-pill px-0 mx-1 d-flex justify-content-center align-items-center"
            style={{ width: "55px" }}>
            <i className="bi bi-arrow-up-right-square text-light"></i>
        </Button>
    </div>
);

const NotificationError = ({ text }) => (
    <div>
        <i className="bi bi-x-circle-fill text-danger mx-2" />
        <span className="text-secondary mx-1">{text}</span>
    </div>
);

const Props = {
    text: PropTypes.string,
};

const DefaultProps = {
    text: "",
};

NotificationSuccess.propTypes = Props;
NotificationSuccess.defaultProps = DefaultProps;

NotificationError.propTypes = Props;
NotificationError.defaultProps = DefaultProps;

export { Notification, NotificationSuccess, NotificationError };