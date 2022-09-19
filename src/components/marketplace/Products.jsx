import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyProductAction, createProductAction, deleteProductAction, getProductsAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Products = ({address, fetchBalance}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getProducts = async () => {
        setLoading(true);
        getProductsAction()
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

    const createProduct = async (data) => {
	    setLoading(true);
	    createProductAction(address, data)
	        .then(() => {
	            toast(<NotificationSuccess text="Project added successfully."/>);
	            getProducts();
	            fetchBalance(address);
	        })
	        .catch(error => {
	            console.log(error);
	            toast(<NotificationError text="Failed to create a project."/>);
	            setLoading(false);
	        })
	};

    const buyProduct = async (product, count) => {
	    setLoading(true);
	    buyProductAction(address, product, count)
	        .then(() => {
	            toast(<NotificationSuccess text="Donated to Project successfully"/>);
	            getProducts();
	            fetchBalance(address);
	        })
	        .catch(error => {
	            console.log(error)
	            toast(<NotificationError text="Failed to Donate Project. Please Try Again"/>);
	            setLoading(false);
	        })
	};

    const deleteProduct = async (product) => {
        setLoading(true);
        deleteProductAction(address, product.appId)
            .then(() => {
                toast(<NotificationSuccess text="Project deleted successfully"/>);
                getProducts();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete project."/>);
                setLoading(false);
            })
    };

    if (loading) {
	    return <Loader/>;
	}
	return (
	    <>
	        <div className="d-flex justify-content-between align-items-center mb-4">
	            <h1 className="fs-4 fw-bold mb-0">FundRaising Projects</h1>
	            <AddProduct createProduct={createProduct}/>
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
	    </>
	);
};

Products.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Products;