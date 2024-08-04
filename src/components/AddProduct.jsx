import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddProduct.scss";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    category: "",
    price: "",
    brand: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const errors = {};
    if (!product.title) {
      errors.title = "Product Name is required";
    }
    if (!product.category) {
      errors.category = "Category is required";
    }
    if (!product.brand) {
      errors.brand = "BrandName is required";
    }
    if (!product.price) {
      errors.price = "Price is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const newProduct = {
          ...product,
          price: Number(product.price)
        };
        const response = await axios.post(
          "http://localhost:3000/products",
          newProduct
        );
        if (response.status === 201) {
          setMessage("Product added successfully!");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        setMessage("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="add-product">
      {message ? (
        <div className="banner">
          <p>{message}</p>
        </div>
      ) : (
        <>
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                placeholder="Enter Product Name"
                name="title"
                id="productName"
                value={product.title}
                onChange={handleChange}
              />
              {errors.title && <div>{errors.title}</div>}
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <input
                type="text"
                placeholder="Enter Product Category"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
              />
              {errors.category && <div>{errors.category}</div>}
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                placeholder="Enter Product Price(in $)"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
              />
              {errors.price && <div>{errors.price}</div>}
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                name="brand"
                id="brand"
                placeholder="Enter Brandname"
                value={product.brand}
                onChange={handleChange}
              />
              {errors.brand && <div>{errors.brand}</div>}
            </div>
            <button type="submit">Add Product</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddProduct;
