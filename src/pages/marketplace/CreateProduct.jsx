// ============================================================
// pages/CreateProduct.jsx — New Product Listing Form
// ============================================================
// Form for creating a new product listing with name, description,
// price, category, condition, stock, and optional image URL.
// Seller info is auto-set from the logged-in user on the backend.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct } from "../../services/api";
import "./ProductForm.css";

const CATEGORIES = [
  "Textbooks",
  "Electronics",
  "Stationery",
  "Clothing",
  "Food & Drinks",
  "Services",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Used - Good", "Used - Fair"];

function CreateProduct() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Textbooks",
    condition: "Used - Good",
    stock: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.description.trim()) e.description = "Please describe your item.";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price greater than 0.";
    if (Number(form.stock) < 1) e.stock = "Quantity must be at least 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
      toast.success("Product listed!");
      navigate("/marketplace/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-form-page container">
      <h1 className="page-title">Sell an Item</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Data Structures Textbook" />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your item..." />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (LKR)</label>
            <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="500" />
            {errors.price && <span className="form-error">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="stock">Quantity</label>
            <input id="stock" name="stock" type="number" min="1" value={form.stock} onChange={handleChange} />
            {errors.stock && <span className="form-error">{errors.stock}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select id="condition" name="condition" value={form.condition} onChange={handleChange}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL (optional)</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-gold btn-lg" disabled={submitting}>
            {submitting ? "Listing..." : "List Item for Sale"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
