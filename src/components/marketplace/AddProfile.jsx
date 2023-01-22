import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Image, Modal, Stack } from "react-bootstrap";
import axios from 'axios';
import { getProfileAction } from '../../utils/profile';
import Loader from '../utils/Loader'


const AddProfile = ({ createProfile, editProfile, address}) => {
    const [appId, setAppId] = useState(0);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [bio, setBio] = useState("");
    const [link, setLink] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [showprofile, setShowprofile] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const getProfile = async () => {
        setLoading(true);
        getProfileAction(address)
            .then(profiles => {
                if (profiles.length > 0) {
                    setProfile(profiles[0]);
                    setAppId(profiles[0].appId);
                    setName(profiles[0].name);
                    setImage(profiles[0].image);
                    setBio(profiles[0].bio);
                    setLink(profiles[0].link);
					console.log(profiles[0]);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleClose = () => setShowprofile(false);
    const handleShow = () => setShowprofile(true);

      function buildFileSelector(){
        const fileSelector = document.createElement('input');
        fileSelector.type = 'file';
        fileSelector.multiple = false;
        fileSelector.onchange = async (e) => { 
            setProfileImg(e.target.files[0])
            console.log(e.target.files[0])
            sendproFileToIPFS(e.target.files[0]);
        }
        fileSelector.accept = 'image/x-png,image/gif,image/jpeg'
        return fileSelector;
      }

      const fileSelect = buildFileSelector();

    const sendproFileToIPFS = async (e) => {
        if (profileImg || e) {
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
                    <span className="font-monospace">Profile</span>
                </div>
            </Stack>
            <Modal show={showprofile} onHide={handleClose} centered>
                <Modal.Header className="d-flex flex-column">
                    <Modal.Title>Add Profile</Modal.Title>
                    <p>Your on-chain profile</p>
                </Modal.Header>
                <Form id="profileform">
                    <Modal.Body>
                        {loading && <Loader height='50px' text='Fetching Profile Data' mode='dark'/>}
                        <center>
                        {image !== '' ? 
                        <Image className="my-3 mx-2" width={120} height={120} src={image} roundedCircle onClick={()=> fileSelect.click()} />
                        : 
                        <Button onClick={()=> fileSelect.click()} 
                        className="rounded-circle py-3 px-2 mb-3 d-flex flex-column justify-content-center align-items-center">
                            <i className="bi bi-person fs-1 px-1" />
                            <p className="px-1"><b>Profile Picture</b></p>
                            </Button>
                        }
                        </center>
                        <FloatingLabel
                            controlId="inputProfileName"
                            label="Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Enter Name"
                            />
                        </FloatingLabel>                        
                        <FloatingLabel
                            controlId="inputBio"
                            label={`Bio ( ${bio.length}/112 Chars )`}
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="Junior Blockchain Developer, Farmer"
                                type="text"
                                value={bio}
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
                            if(profile){
                                editProfile({
                                    name,
                                    image,
                                    bio,
                                    link,
                                    appId
                                });
                            } else {
                                createProfile({
                                    name,
                                    image,
                                    bio,
                                    link
                                });
                                handleClose();
                            }
                        }}
                    >
                        {profile ? 'Update ' : 'Save ' }Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

AddProfile.propTypes = {
    createProfile: PropTypes.func.isRequired,
    editProfile: PropTypes.func.isRequired,
    address: PropTypes.string
};

export default AddProfile;