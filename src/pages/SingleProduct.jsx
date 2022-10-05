import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/utils/Loader";
import { NotificationError, NotificationSuccess } from "../components/utils/Notifications";
import { buyProductAction, deleteProductAction, getProductAction, } from "../utils/marketplace";
import PropTypes from "prop-types";
import { Button, Row } from "react-bootstrap";
import ProductSingle from "../components/marketplace/ProductSingle";
import Comments from "../components/marketplace/Comments";

const SingleProduct = ({ address, fetchBalance }) => {
	const [products, setProducts] = useState([]);
	const [comments, setComments] = useState(0);
	const [loading, setLoading] = useState(true);
	const queryParams = new URLSearchParams(window.location.search);
	const appId = queryParams.get('appId');

	const setCommentsCount = (num)=>{
		setComments(num);
	}

	const getProducts = async () => {
		setLoading(true);
		getProductAction(appId)
			.then(products => {
				if (products) {
					setProducts(products);
					console.log(products);
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
		getProducts();
	}, []);

	const likeProject = async (data) => {
		
	};

	const buyProduct = async (product, count) => {
		setLoading(true);
		buyProductAction(address, product, count)
			.then(() => {
				toast(<NotificationSuccess text="Donated to Project successfully" />);
				getProducts();
				fetchBalance(address);
			})
			.catch(error => {
				console.log(error)
				toast(<NotificationError text="Failed to Donate Project. Please Try Again" />);
				setLoading(false);
			})
	};

	const deleteProduct = async (product) => {
		setLoading(true);
		deleteProductAction(address, product.appId)
			.then(() => {
				toast(<NotificationSuccess text="Project deleted successfully" />);
				getProducts();
				fetchBalance(address);
			})
			.catch(error => {
				console.log(error)
				toast(<NotificationError text="Failed to delete project." />);
				setLoading(false);
			})
	};

	if (loading) {
		return <Loader />;
	}
	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="fs-3 mb-0">{products[0].name}</h1>
				<div>
					<Button
						onClick={likeProject}
						variant="dark"
						className="rounded-pill px-0 mx-1"
						style={{ width: "45px" }}
						data-bs-toggle="tooltip" data-bs-placement="top" title="Like" >
						<i className="bi bi-heart-fill"></i>
					</Button>
					<Button
						href={'#comments'}
						variant="dark"
						className="rounded-pill px-0"
						style={{ width: "50px" }}
						data-bs-toggle="tooltip" data-bs-placement="top" title={`${comments} | Comment`} > 
						{comments}&nbsp;&nbsp;<i className="bi bi-chat-square-text"></i> 

					</Button>
				</div>
			</div>
			<ProductSingle
				address={address}
				product={products[0]}
				buyProduct={buyProduct}
				deleteProduct={deleteProduct}
				key={products[0].appId}
			/>
			<Comments
				address={address}
				gComments={setCommentsCount}
				name={products[0].name}
				uid={products[0].appId} />
		</>
	);
};

SingleProduct.propTypes = {
	address: PropTypes.string.isRequired,
	fetchBalance: PropTypes.func.isRequired
};

export default SingleProduct;