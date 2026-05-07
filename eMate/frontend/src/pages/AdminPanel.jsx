import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Daily Use', 'Books', 'Stationary', 'Electronics'];

const emptyForm = { name: '', price: '', category: 'Daily Use', description: '', stock: '', image: null };

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const { data } = await getProducts();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== '') formData.append(key, val);
      });

      if (editId) {
        await updateProduct(editId, formData);
        toast.success('Product updated! ✅');
      } else {
        await addProduct(formData);
        toast.success('Product added! 🎉');
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
      image: null,
    });
    setEditId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">👑 Admin Panel</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            📋 Orders
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
            className="btn-primary"
          >
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Product name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="e.g. 299" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required placeholder="e.g. 50" className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Product description..." rows={3} className="input-field resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? 'Saving...' : editId ? 'Update Product ✅' : 'Add Product 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b bg-green-50">
          <h2 className="font-semibold text-gray-700">All Products ({products.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span>📦</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">₹{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.stock > 0 ? p.stock : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400">
                    No products found. Add your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
