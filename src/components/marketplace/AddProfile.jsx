import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Image, Modal, Stack } from "react-bootstrap";
import axios from 'axios';

const AddProfile = ({ createProfile }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [bio, setBio] = useState("");
    const [link, setLink] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [showprofile, setShowprofile] = useState(false);

    const handleClose = () => setShowprofile(false);
    const handleShow = () => setShowprofile(true);

    const sendFileToIPFS = async (e) => {
        if (profileImg) {
            try {

                const formData = new FormData();
                formData.append("file", profileImg);
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
        if (name.length > 112 || name.length < 1) { return false }
        console.log(name)
        if (image.length > 112 || image.length < 1) { return false }
        console.log(image)
        if (bio.length > 112 || bio.length < 1) { return false }
        console.log(bio)
        if (link.length > 112 || link.length < 1) { return false }
        console.log(link)
        return true;
    }, [name, image, bio, link]);

    
    return (
        <>
            <Stack onClick={handleShow} direction="horizontal" gap={2}>
                <i className="bi bi-person fs-4" />
                <div className="d-flex flex-column">
                    <span className="font-monospace">Your Profile</span>
                </div>
            </Stack>
            <Modal show={showprofile} onHide={handleClose} centered>
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Add Profile</Modal.Title>
                    <p>Your on-chain profile</p>
                </Modal.Header>
                <Form id="profileform">
                    <Modal.Body>
                        <FloatingLabel
                            controlId="inputProfileName"
                            label="Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Enter Name"
                            />
                        </FloatingLabel>
                        <Form.Label>Select Profile Image</Form.Label>
                        <div className="d-flex gap-2 mb-3">
                            <Form.Control aria-controls="proFile" id="proFile" type="file" onChange={(f) => setProfileImg(f.target.files[0])} accept="image/x-png,image/gif,image/jpeg" />
                            <Button variant="primary" onClick={sendFileToIPFS}>
                                Upload
                            </Button>
                        </div>
                        {image !== "" &&
                            <div className="mb-3">
                                <Image src={image} rounded className="w-100" />
                            </div>}
                        <FloatingLabel
                            controlId="inputBio"
                            label={`Bio ( ${bio.length}/112 Chars )`}
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="Junior Blockchain Developer, Farmer"
                                maxLength={112}
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setBio(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputProfileLink"
                            label="Your Link"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Link to your website or whatever"
                                value={link}
                                onChange={(e) => {
                                    setLink(e.target.value);
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
                            createProfile({
                                name,
                                image,
                                bio,
                                link
                            });
                            handleClose();
                        }}
                    >
                        Save Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

AddProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
};

export default AddProfile;