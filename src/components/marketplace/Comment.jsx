import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import { truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";

const Comment = ({address, comments}) => {
    const {comment, appId, owner} =
        comments;

    return (
        <Col key={appId}>
            <Card className="h-100 bg-dark">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                    <Identicon size={28} address={owner}/>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                    </Stack>
                </Card.Header>
                <Card.Body className="d-flex flex-column text-light">
                    <Card.Text className="flex-grow-1">{comment}</Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
};

Comment.propTypes = {
    address: PropTypes.string.isRequired,
    comments: PropTypes.instanceOf(Object).isRequired,
};

export default Comment;