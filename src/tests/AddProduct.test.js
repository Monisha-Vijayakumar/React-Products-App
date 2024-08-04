import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import AddProduct from "../components/AddProduct";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios");

describe("AddProduct Component", () => {
  test("renders form elements", () => {
    render(
      <Router>
        <AddProduct />
      </Router>
    );
    expect(screen.getByLabelText(/product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
  });

  test("validates fields before submitting", async () => {
    render(
      <Router>
        <AddProduct />
      </Router>
    );

    fireEvent.click(screen.getByText(/add product/i));
    expect(screen.getByText("Product Name is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(screen.getByText("Price is required")).toBeInTheDocument();
    expect(screen.getByText("BrandName is required")).toBeInTheDocument();
  });

  test("submits form on successful API call", async () => {
    axios.post.mockResolvedValue({ status: 201 });

    render(
      <Router>
        <AddProduct />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/product/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/brand/i), {
      target: { value: "New Brand" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "New Category" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: 300 },
    });

    fireEvent.click(screen.getByText(/Add Product/i));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/products",
        {
          title: "New Product",
          brand: "New Brand",
          category: "New Category",
          price: 300,
        }
      )
    );

    await waitFor(() =>
      expect(
        screen.getByText("Product added successfully!")
      ).toBeInTheDocument()
    );
  });

  test("shows error message on failed API call", async () => {
    axios.post.mockRejectedValue(new Error("Failed to add product"));

    render(
      <Router>
        <AddProduct />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/product/i), {
      target: { value: "New Product" },
    });
    fireEvent.change(screen.getByLabelText(/brand/i), {
      target: { value: "New Brand" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "New Category" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: 300 },
    });

    fireEvent.click(screen.getByText(/Add Product/i));

    await waitFor(() =>
      expect(
        screen.getByText("Failed to add product. Please try again.")
      ).toBeInTheDocument()
    );
  });
});
