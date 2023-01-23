import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddProduct from "../components/marketplace/AddProduct";
import Product from "../components/marketplace/Product";
import Loader from "../components/utils/Loader";
import { NotificationError, NotificationSuccess } from "../components/utils/Notifications";
import { buyProductAction, createProductAction, deleteProductAction, getProductsAction, } from "../utils/marketplace";
import PropTypes from "prop-types";
import { Row, Carousel, Container, Image } from "react-bootstrap";
import getIPFS from "../utils/getIPFS";

const Products = ({ address, fetchBalance }) => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	const getProducts = async () => {
		setLoading(true);
		getProductsAction()
			.then(products => {
				if (products) {
					setProducts(products);
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

	const createProduct = async (data) => {
		setLoading(true);
		createProductAction(address, data)
			.then((tx) => {
				toast(<NotificationSuccess text="Project added successfully." tx_id={tx[1]} />);
				getProducts();
				fetchBalance(address);
			})
			.catch(error => {
				console.log(error);
				toast(<NotificationError text="Failed to create a project." />);
				setLoading(false);
			})
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
		try {
			setLoading(true);
			await deleteProductAction(address, product.appId)
			toast(<NotificationSuccess text="Project deleted successfully" />);
			getProducts();
			fetchBalance(address);
		} catch (e) {
			console.log(e)
			toast(<NotificationError text="Failed to delete project." />);

		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <Loader />;
	}
	return (
		<>
			<Carousel>
			{products.map((product, index) => (
				<Carousel.Item interval={6000}>
					<Image
						width={'100%'}
						className="ratio ratio-16x9"
						src={getIPFS(product.image)}
						alt={product.name}
					/>
					<Carousel.Caption>
						<h3 className="bg-black bg-opacity-75 p-2 w-fit-content">{product.name}</h3>
						<p className="bg-black bg-opacity-75 p-2 w-fit-content">{product.description}</p>
					</Carousel.Caption>
				</Carousel.Item>
			))}
			</Carousel>
			<Container fluid="lg">
			<div className="d-flex justify-content-between align-items-center my-4">
				<h1 className="fs-4 fw-bold mb-0">FundRaising Projects</h1>
				<AddProduct createProduct={createProduct} />
			</div>
			<Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
				<>
					{products.map((product, index) => (
						<Product
							address={address}
							product={product}
							buyProduct={buyProduct}
							deleteProduct={deleteProduct}
							key={index}
						/>
					))}
				</>
			</Row>
			</Container>
		</>
	);
};

Products.propTypes = {
	address: PropTypes.string.isRequired,
	fetchBalance: PropTypes.func.isRequired
};

export default Products;
