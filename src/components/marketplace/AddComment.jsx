import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";


const AddComment = ({ createComment , name}) => {
    const [comment, setComment] = useState("");

    const isFormFilled = useCallback(() => {
        if (comment.length > 162 || comment.length < 1) { return false }
        console.log(comment)
        return true;
    }, [comment]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className="rounded-pill px-0"
                style={{ width: "138px" }}
            >
                <i className="bi bi-plus"></i>
                Add Comment
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Commenting</Modal.Title>
                    <p>on {name}</p>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="inputComment"
                            label={`Comment ( ${comment.length}/112 Chars )`}
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="Nice Project, I will definitely Donate. Would love to see the results"
                                maxLength={112}
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                </Form>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!isFormFilled()}
                        onClick={() => {
                            createComment({
                                comment
                            });
                            handleClose();
                        }}
                    >
                        Comment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

AddComment.propTypes = {
    createComment: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default AddComment;