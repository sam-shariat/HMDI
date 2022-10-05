import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";
import { stringToMicroAlgos } from "../../utils/conversions";
import axios from 'axios';

const AddProduct = ({ createProduct }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [donation, setDonation] = useState(0);
    const [fileImg, setFileImg] = useState(null);
    const [goaldonation, setGoaldonation] = useState(0);

    const sendproFileToIPFS = async (e) => {
        if (fileImg) {
            try {

                const formData = new FormData();
                formData.append("file", fileImg);
                console.log('uploading file to ipfs')
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
                        'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
                        'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                console.log(ImgHash);
                setImage(ImgHash);
                //Take a look at your Pinata Pinned section, you will see a new file added to you list.   

            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    }

    const isFormFilled = useCallback(() => {
        if (name.length > 162 || name.length < 1) { return false }
        console.log(name)
        if (image.length > 162 || image.length < 1) { return false }
        console.log(image)
        if (description.length > 162 || description.length < 1) { return false }
        console.log(description)
        if (link.length > 162 || link.length < 1) { return false }
        console.log(link)
        if ((Number(donation) / 1000000) >= 100 || (Number(donation) / 1000000) < 1) { return false }
        if ((Number(goaldonation) / 1000000) >= 10000 || (Number(goaldonation) / 1000000) < 1) { return false }
        if (Number(goaldonation) < 0 || Number(donation) < 0) { return false }
        console.log(goaldonation)
        return true;
    }, [name, image, description, link, donation, goaldonation]);

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
                        <Form.Label>Select Image</Form.Label>
                        <div className="d-flex gap-2 mb-3">
                            <Form.Control type="file" onChange={(e) => setFileImg(e.target.files[0])} accept="image/x-png,image/gif,image/jpeg" />
                            <Button variant="primary" onClick={sendproFileToIPFS}>
                                Upload
                            </Button>
                        </div>
                        {image !== "" &&
                        <div className="mb-3">
                            <Image src={image} rounded className="w-100" />
                        </div>}
                        <FloatingLabel
                            controlId="inputDescription"
                            label={`Description ( ${description.length}/112 Chars )`}
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
                            label="Link To Proposal or Website"
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
                            controlId="inputDonation"
                            label="Each Donation (Max 99)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                max={10}
                                placeholder="Each Donation in ALGO (Max 99)"
                                onChange={(e) => {
                                    setDonation(stringToMicroAlgos(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputGoaldonation"
                            label="Total Donation Goal (Max 9999)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                max={10}
                                placeholder="Total Needed Donation in ALGO (Max 9999)"
                                onChange={(e) => {
                                    setGoaldonation(stringToMicroAlgos(e.target.value));
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
                                donation,
                                goaldonation
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