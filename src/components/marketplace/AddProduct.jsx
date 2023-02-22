import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, Container, FloatingLabel, Form, FormLabel, Image, Modal } from "react-bootstrap";
import { stringToMicroAlgos } from "../../utils/conversions";
import axios from 'axios';
import ReactQuill from 'react-quill';
import '../../styles/quill.snow.css';
import getIPFS from "../../utils/getIPFS";

const AddProduct = ({ createProduct , className, label}) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [longdes, setLongdes] = useState('');
    const [donation, setDonation] = useState(0);
    const [goaldonation, setGoaldonation] = useState(0);

    const handleLongDes=(e)=> {
        setLongdes(e);
    }

    const handleFormSubmit = async() =>{
        var link = '';
        var data = JSON.stringify({
            "pinataOptions": {
              "cidVersion": 1
            },
            "pinataMetadata": {
              "name": name,
              "keyvalues": {
                "image": image,
                "description": description
              }
            },
            "pinataContent": {
              "content": longdes
            }
          });
        try {
            console.log('uploading description to ipfs')
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: data,
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
                    'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
                    "Content-Type": "application/json"
                },
            });

            link = resFile.data.IpfsHash;
            //Take a look at your Pinata Pinned section, you will see a new file added to you list.   

        } catch (error) {
            console.log("Error sending description to IPFS: ")
            console.log(error)
            return ;
        }

        createProduct({
            name,
            image,
            description,
            link,
            donation,
            goaldonation
        });
        handleClose();
    }

    const sendFileToIPFS = async (e) => {
        if (e) {
            try {

                const formData = new FormData();
                formData.append("file", e);
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

                const ImgHash = resFile.data.IpfsHash;
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
        console.log(longdes);
        if (image.length > 162 || image.length < 1) { return false }
        console.log(image)
        if (description.length > 162 || description.length < 1) { return false }
        console.log(description)
        if ((Number(donation) / 1000000) >= 100 || (Number(donation) / 1000000) < 1) { return false }
        if ((Number(goaldonation) / 1000000) >= 10000 || (Number(goaldonation) / 1000000) < 1) { return false }
        if (Number(goaldonation) < 0 || Number(donation) < 0) { return false }
        console.log(goaldonation)
        return true;
    }, [name, image, description, longdes, donation, goaldonation]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className={className}
                style={{ width: "fit-content" }}
            >
                {label}
            </Button>
            <Modal show={show} onHide={handleClose} centered fullscreen className="thin-scroll bg-white">
            <Container fluid="md">
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Raise Funds</Modal.Title>
                    <p>Tell Us More About Your Project</p>
                </Modal.Header>
                <Form className="h-fit-content">
                    <Modal.Body>
                    <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                className="py-2 mb-3"
                                placeholder="Enter Your Cause"
                            />
                        
                        <Form.Label>Select Image</Form.Label>
                        <div className="d-flex gap-2 mb-3">
                            <Form.Control
                                className="py-2"
                                type="file" onChange={(e) => { 
                                sendFileToIPFS(e.target.files[0])
                                }} accept="image/x-png,image/gif,image/jpeg" />
                        </div>
                        {image !== "" &&
                        <div className="mb-3">
                            <Image src={getIPFS(image)} rounded className="w-100" />
                        </div>}
                        <Form.Label>{`Description ( ${description.length}/112 Chars )`}
                        </Form.Label>
                            <Form.Control
                                as="textarea"
                                className="mb-3"
                                placeholder="I need 200 ALGOs to build a website to promote what I do"
                                maxLength={162}
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        
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
                        <FormLabel className="mb-2">
                            Your Proposal
                        </FormLabel>
                        <ReactQuill 
                        modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, false] }],
                              [{'align':[]}],
                              ['bold', 'italic', 'underline'],
                              [{'list': 'ordered'}, {'list': 'bullet'},'code-block'],
                              ['link','image','video']
                            ]
                          }}
                        style={{height:'120px',marginBottom:'50px'}} 
                        theme="snow" 
                        value={longdes} 
                        onChange={handleLongDes} />
                        
                    </Modal.Body>
                </Form>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!isFormFilled()}
                        onClick={handleFormSubmit}>
                        Publish Project To Start Raising Funds
                    </Button>
                </Modal.Footer>
                </Container>
            </Modal>
        </>
    );
};

AddProduct.propTypes = {
    createProduct: PropTypes.func.isRequired,
    className: PropTypes.string,
};

AddProduct.defaultProps = {
    className:"rounded-pill px-3",
    label:"Get Started"
}

export default AddProduct;