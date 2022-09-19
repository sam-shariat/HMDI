import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {stringToMicroAlgos} from "../../utils/conversions";

const AddProduct = ({createProduct}) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [price, setPrice] = useState(0);
    const [neededprice, setNeededPrice] = useState(0);

    const isFormFilled = useCallback(() => {
        if(name.length > 162 || name.length < 1 ){ return false }
        console.log(name)
        if(image.length > 162 || image.length < 1 ){ return false }
        console.log(image)
        if(description.length > 162 || description.length < 1 ){ return false }
        console.log(description)
        if(link.length > 162 || link.length < 1 ){ return false }
        console.log(link)
        if((Number(price)/1000000) >= 100 || (Number(price)/1000000) < 1 ){ return false }
        if((Number(neededprice)/1000000) >= 10000 || (Number(neededprice)/1000000) < 1 ){ return false }
        if(Number(neededprice) < 0 || Number(price) < 0 ){ return false }
        console.log(neededprice)
        return true;
    }, [name, image, description, link, price, neededprice]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className="rounded-pill px-0"
                style={{width: "138px"}}
            >
                <i className="bi bi-plus"></i>
                Add Project
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Raise Funds</Modal.Title>
                    <p>Tell Us More About Your Project</p>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="inputName"
                            label="Project Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Enter name of project"
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputUrl"
                            label="Image URL Of Your Project"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Image URL https://example.com/image.jpg"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputDescription"
                            label="Description ( Max 162 Chars )"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="I need 200 ALGOs to build a website to promote what I do"
                                maxLength={162}
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputLinkUrl"
                            label="Link To Proposal"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Link to your proposal"
                                value={link}
                                onChange={(e) => {
                                    setLink(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputPrice"
                            label="Each Donation (Max 99)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                max={10}
                                placeholder="Each Donation in ALGO (Max 99)"
                                onChange={(e) => {
                                    setPrice(stringToMicroAlgos(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputNeededPrice"
                            label="Total Donation Goal (Max 9999)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                max={10}
                                placeholder="Total Needed Donation in ALGO (Max 9999)"
                                onChange={(e) => {
                                    setNeededPrice(stringToMicroAlgos(e.target.value));
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
                            createProduct({
                                name,
                                image,
                                description,
                                link,
                                price,
                                neededprice
                            });
                            handleClose();
                        }}
                    >
                        Save Project To Start Raising Funds
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

AddProduct.propTypes = {
    createProduct: PropTypes.func.isRequired,
};

export default AddProduct;