import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";
import { createCommentAction, getCommentsAction } from "../../utils/comments";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Comments = ({address,uid,name,gComments}) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getComments = async () => {
        setLoading(true);
        getCommentsAction(uid)
            .then(comments => {
                if (comments) {
                    setComments(comments);
                    gComments(comments.length);
					console.log(comments);
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
        getComments();
    }, []);

    const createComment = async (data) => {
	    setLoading(true);
	    createCommentAction(address, data, uid)
	        .then((tx) => {
	            toast(<NotificationSuccess text="Comment added successfully." tx_id={tx[1]}/>);
	            getComments();
	        })
	        .catch(error => {
	            console.log(error);
	            toast(<NotificationError text="Failed to create a Comment."/>);
	            setLoading(false);
	        })
	};

    if (loading) {
	    return <Loader height="100px"/>;
	}
	return (
	    <>
	        <div id="comments" className="d-flex justify-content-between align-items-center mb-4">
	            <h1 className="fs-4 fw-bold mb-0">Comments</h1>
	            <AddComment createComment={createComment} name={name}/>
	        </div>
	        <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
	            <>
	                {comments.map((comment, index) => (
	                    <Comment
	                        address={address}
	                        comments={comment}
	                        key={index}
	                    />
	                ))}
	            </>
	        </Row>
	    </>
	);
};

Comments.propTypes = {
    uid: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gComments: PropTypes.func.isRequired
};

export default Comments;