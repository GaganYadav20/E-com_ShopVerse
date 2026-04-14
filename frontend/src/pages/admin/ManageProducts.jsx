import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck } from 'react-icons/hi';

const emptyForm = { name: '', description: '', price: '', category: '', imageUrl: '', stock: '' };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll(page, 10, 'id', 'desc');
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category,
      imageUrl: product.imageUrl || '',
      stock: product.stock?.toString() || '0',
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
      };
      if (editingId) {
        await productAPI.update(editingId, payload);
        toast.success('Product updated');
      } else {
        await productAPI.create(payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Products</h1>
          <p className="text-dark-400 mt-1">Add, edit, and remove products from your store</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm
                     hover:shadow-lg hover:shadow-primary-500/30 transition-all">
          <HiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left px-6 py-4 text-xs text-dark-500 uppercase tracking-wider font-medium">Product</th>
                <th className="text-left px-6 py-4 text-xs text-dark-500 uppercase tracking-wider font-medium">Category</th>
                <th className="text-left px-6 py-4 text-xs text-dark-500 uppercase tracking-wider font-medium">Price</th>
                <th className="text-left px-6 py-4 text-xs text-dark-500 uppercase tracking-wider font-medium">Stock</th>
                <th className="text-right px-6 py-4 text-xs text-dark-500 uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/30">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-dark-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl || 'https://via.placeholder.com/48'} alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-dark-100 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-dark-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-xs font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-dark-200">${product.price?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(product)}
                        className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-dark-700/50">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="px-3 py-1.5 rounded-lg glass text-sm text-dark-400 disabled:opacity-40 transition-all">Prev</button>
            <span className="text-sm text-dark-400">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg glass text-sm text-dark-400 disabled:opacity-40 transition-all">Next</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg glass rounded-2xl p-6 sm:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-dark-400 hover:text-white transition-colors">
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Product Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white placeholder-dark-500
                             focus:outline-none focus:border-primary-500/50 transition-all text-sm" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white placeholder-dark-500
                             focus:outline-none focus:border-primary-500/50 transition-all text-sm resize-none" placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Price *</label>
                  <input type="number" step="0.01" min="0.01" required value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white
                               focus:outline-none focus:border-primary-500/50 transition-all text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Stock *</label>
                  <input type="number" min="0" required value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white
                               focus:outline-none focus:border-primary-500/50 transition-all text-sm" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Category *</label>
                <input type="text" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white
                             focus:outline-none focus:border-primary-500/50 transition-all text-sm" placeholder="e.g. Electronics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Image URL</label>
                <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-dark-700/50 text-white
                             focus:outline-none focus:border-primary-500/50 transition-all text-sm" placeholder="https://..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-300 font-medium text-sm hover:border-dark-500 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm
                             disabled:opacity-60 transition-all">
                  {saving ? <div className="spinner w-4 h-4 border-2" /> : <><HiCheck className="w-4 h-4" /> {editingId ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
