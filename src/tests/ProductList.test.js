import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import ProductList from "../components/ProductList";
import "@testing-library/jest-dom";

jest.mock("axios");

const mockProducts = [
  {
    id: 1,
    title: "Product 1",
    category: "Category 1",
    price: 100,
    brand: "Brand 1",
  },
  {
    id: 2,
    title: "Product 2",
    category: "Category 2",
    price: 200,
    brand: "Brand 2",
  },
];

describe("ProductList Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
    axios.put.mockResolvedValue({ data: mockProducts[0] });
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays products", async () => {
    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() =>
      expect(screen.getByText("Product 1")).toBeInTheDocument()
    );
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    axios.get.mockReturnValue(new Promise(() => {}));

    render(
      <Router>
        <ProductList />
      </Router>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch products"));

    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/products")
    );

    expect(screen.getByText("Failed to fetch products")).toBeInTheDocument();
  });

  test("deletes a product and shows success message", async () => {
    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => screen.getByText("Product 1"));

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:3000/products/1"
      )
    );
    await waitFor(() =>
      expect(
        screen.getByText("Product deleted successfully")
      ).toBeInTheDocument()
    );
  });

  test("edits a product and shows success message", async () => {
    axios.put.mockResolvedValueOnce({
      status: 200,
      data: {
        id: 1,
        title: "Updated Product 1",
        category: "Updated Category 1",
        price: 150,
        brand: "Updated Brand 1",
      },
    });

    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => screen.getByText("Product 1"));

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.change(screen.getByDisplayValue("Product 1"), {
      target: { value: "Updated Product 1" },
    });
    fireEvent.change(screen.getByDisplayValue("Category 1"), {
      target: { value: "Updated Category 1" },
    });
    fireEvent.change(screen.getByDisplayValue(100), { target: { value: 150 } });
    fireEvent.change(screen.getByDisplayValue("Brand 1"), {
      target: { value: "Updated Brand 1" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:3000/products/1",
        {
          title: "Updated Product 1",
          category: "Updated Category 1",
          price: 150,
          brand: "Updated Brand 1",
          id: 1,
        }
      )
    );

    await waitFor(() =>
      expect(
        screen.getByText("Product updated successfully")
      ).toBeInTheDocument()
    );
  });

  test("shows validation errors when fields are empty", async () => {
    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => screen.getByText("Product 1"));

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.change(screen.getByDisplayValue("Product 1"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByDisplayValue("Category 1"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByDisplayValue(100), { target: { value: "" } });
    fireEvent.change(screen.getByDisplayValue("Brand 1"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(screen.getByText("Price is required")).toBeInTheDocument();
    expect(screen.getByText("Brand is required")).toBeInTheDocument();
  });
});
