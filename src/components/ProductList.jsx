import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProductList.scss";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    title: "",
    category: "",
    price: 0,
    brand: "",
    id: 0,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const API_URL = "http://localhost:3000/products";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleAddProduct = () => {
    navigate("/add");
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setSuccessMessage("Product deleted successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setError("Failed to delete the product");
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setUpdatedProduct({
      title: product.title,
      category: product.category,
      price: product.price,
      brand: product.brand,
      id: product.id,
    });
    setValidationErrors({});
  };

  const validateFields = () => {
    const errors = {};
    if (!updatedProduct.title) errors.title = "Title is required";
    if (!updatedProduct.category) errors.category = "Category is required";
    if (!updatedProduct.price) errors.price = "Price is required";
    if (!updatedProduct.brand) errors.brand = "Brand is required";
    return errors;
  };

  const saveProduct = async (id) => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      const productToUpdate = {
        ...updatedProduct,
        price: Number(updatedProduct.price)
      };
      const response = await axios.put(`${API_URL}/${id}`, productToUpdate);
      if (response.status === 200) {
        setProducts(
          products.map((product) =>
            product.id === id ? response.data : product
          )
        );
        setEditingProductId(null);
        setSuccessMessage("Product updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        setValidationErrors({});
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update the product");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const cancelChanges = () => {
    setEditingProductId(null);
  };

  return (
    <div className="product-list">
      {successMessage && <div className="success-banner">{successMessage}</div>}
      {error && <div className="error-banner">{error}</div>}
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4> Product List</h4>
        <button
          style={{ marginLeft: "auto", marginRight: "10px", height: "25px" }}
          onClick={handleAddProduct}
        >
          Add New Product
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={editingProductId === product.id ? 'edit-row' : ''}>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <input
                        type="text"
                        name="title"
                        value={updatedProduct.title}
                        onChange={handleChange}
                        className={validationErrors.title ? "input-error" : ""}
                      />
                      {validationErrors.title && (
                        <span className="error-message">
                          {validationErrors.title}
                        </span>
                      )}
                    </>
                  ) : (
                    product.title
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <input
                        type="text"
                        name="category"
                        value={updatedProduct.category}
                        onChange={handleChange}
                        className={
                          validationErrors.category ? "input-error" : ""
                        }
                      />
                      {validationErrors.category && (
                        <span className="error-message">
                          {validationErrors.category}
                        </span>
                      )}
                    </>
                  ) : (
                    product.category
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <input
                        type="number"
                        name="price"
                        value={updatedProduct.price}
                        onChange={handleChange}
                        className={validationErrors.price ? "input-error" : ""}
                      />
                      {validationErrors.price && (
                        <span className="error-message">
                          {validationErrors.price}
                        </span>
                      )}
                    </>
                  ) : (
                    '$' + product.price
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <input
                        type="text"
                        name="brand"
                        value={updatedProduct.brand}
                        onChange={handleChange}
                        className={validationErrors.brand ? "input-error" : ""}
                      />
                      {validationErrors.brand && (
                        <span className="error-message">
                          {validationErrors.brand}
                        </span>
                      )}
                    </>
                  ) : (
                    product.brand
                  )}
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <>
                      <button onClick={() => saveProduct(product.id)}>
                        Save
                      </button>
                      <button onClick={() => cancelChanges(product.id)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(product)}>
                        Edit
                      </button> {' '}
                      <button onClick={() => deleteProduct(product.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
