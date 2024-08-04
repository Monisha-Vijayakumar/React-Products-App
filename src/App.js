import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import "./App.scss";

const App = () => {
  return (
    <Router>
      <div>
        <header className="fixed-header">
          <div className="header-content">
            <h3>Product Management Dashboard</h3>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add" element={<AddProduct />} />
          </Routes>
        </main>
        <div className="footer-content">
          <h3>Footer</h3>
        </div>
      </div>
    </Router>
  );
};

export default App;
