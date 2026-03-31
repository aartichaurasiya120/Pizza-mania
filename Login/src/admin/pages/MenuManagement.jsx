import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useCart } from '../../context/CartContext';
import '../styles/admin.css';
import '../styles/table.css';

const CATEGORIES = [
    { value: 'pizzas', label: 'Pizza' },
    { value: 'melts', label: 'Melts' },
    { value: 'sides', label: 'Sides' },
    { value: 'pastas', label: 'Pastas' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'drinks', label: 'Drinks' },
];

const PIZZA_PRICES = [
    { key: 'personalPan', label: 'Personal Pan' },
    { key: 'mediumPan', label: 'Medium Pan' },
    { key: 'personalStuffedCrustMaxx', label: 'Personal Stuffed Crust Maxx' },
    { key: 'mediumStuffedCrustMaxx', label: 'Medium Stuffed Crust Maxx' },
    { key: 'largeThinNCrispy', label: 'Large Thin n Crispy' },
];

const EMPTY_PIZZA_PRICES = Object.fromEntries(PIZZA_PRICES.map(({ key }) => [key, '']));

const EMPTY_ITEM = {
    category: 'pizzas',
    tittle: '',
    description: '',
    img: '',
    calories: '',
    prices: '',
};

const MenuManagement = () => {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState(EMPTY_ITEM);
    const [pizzaPrices, setPizzaPrices] = useState(EMPTY_PIZZA_PRICES);
    const { triggerMenuRefresh } = useCart();

    useEffect(() => { fetchMenuItems(); }, []);

    const fetchMenuItems = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('http://localhost:8080/api/admin/menu', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(data.items);
        } catch (err) {
            console.error('Error fetching menu:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const isPizza = currentItem.category === 'pizzas';
        const itemData = {
            ...currentItem,
            // Pizza → send a prices map; all others → send a plain Number
            prices: isPizza
                ? Object.fromEntries(PIZZA_PRICES.map(({ key }) => [key, Number(pizzaPrices[key])]))
                : Number(currentItem.prices),
        };
        try {
            if (editMode) {
                await axios.put(
                    `http://localhost:8080/api/admin/menu/${currentItem._id}`,
                    itemData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post('http://localhost:8080/api/admin/menu', itemData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            closeModal();
            fetchMenuItems();
            // Instantly update all frontend menu pages without a page refresh
            if (!editMode) triggerMenuRefresh();
        } catch (err) {
            console.error('Error saving item:', err);
        }
    };

    const handleDelete = async (itemId, category) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(
                `http://localhost:8080/api/admin/menu/${itemId}?category=${category}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMenuItems();
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    const openEditModal = (item) => {
        setCurrentItem({
            ...item,
            prices: typeof item.prices === 'object' ? Object.values(item.prices)[0] : item.prices,
        });
        if (item.category === 'pizzas' && typeof item.prices === 'object') {
            setPizzaPrices({ ...EMPTY_PIZZA_PRICES, ...item.prices });
        }
        setEditMode(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentItem(EMPTY_ITEM);
        setPizzaPrices(EMPTY_PIZZA_PRICES);
        setEditMode(false);
    };

    const isPizza = currentItem.category === 'pizzas';

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <Topbar title="Menu Management" subtitle="Manage all menu items" />
                <div className="table-container">
                    <div className="table-header">
                        <h2>Menu Items</h2>
                        <button className="add-btn" onClick={() => { closeModal(); setShowModal(true); }}>
                            + Add Item
                        </button>
                    </div>

                    <div className="table-wrapper">
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Calories</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item._id}>
                                            <td><img src={item.img} alt={item.tittle} className="item-image" /></td>
                                            <td>{item.tittle}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                                            <td>
                                                {
                                                    typeof item.prices === 'number'
                                                        ? `₹${item.prices}`
                                                        : item.prices && typeof item.prices === 'object'
                                                            ? Object.entries(item.prices).map(([key, value]) => (
                                                                <div key={key}>
                                                                    {key}: ₹{value}
                                                                </div>
                                                            ))
                                                            : '₹0'
                                                }
                                            </td>                                            <td>{item.calories}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-edit" onClick={() => openEditModal(item)}>Edit</button>
                                                    <button className="btn-delete" onClick={() => handleDelete(item._id, item.category)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal ── */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <span className="modal-icon">🍕</span>
                                <h3>{editMode ? 'Edit Item' : 'Add New Item'}</h3>
                            </div>
                            <button className="close-btn" onClick={closeModal} aria-label="Close">✕</button>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit}>

                            {/* Row 1 — Category + Name */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={currentItem.category}
                                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                                        required
                                    >
                                        {CATEGORIES.map(({ value, label }) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Item name"
                                        value={currentItem.tittle}
                                        onChange={(e) => setCurrentItem({ ...currentItem, tittle: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Brief description of the item..."
                                    value={currentItem.description}
                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Row 2 — Image URL + Calories */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={currentItem.img}
                                        onChange={(e) => setCurrentItem({ ...currentItem, img: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Calories</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 320 kcal"
                                        value={currentItem.calories}
                                        onChange={(e) => setCurrentItem({ ...currentItem, calories: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* ── Dynamic Price Section ── */}
                            {isPizza ? (
                                <div className="price-section">
                                    <div className="price-section-header">
                                        <span className="price-section-title">Pizza Prices (₹)</span>
                                        <span className="price-section-badge">5 sizes</span>
                                    </div>
                                    <div className="pizza-price-grid">
                                        {PIZZA_PRICES.map(({ key, label }) => (
                                            <div key={key} className="pizza-price-field">
                                                <label>{label}</label>
                                                <div className="price-input-wrap">
                                                    <span className="price-prefix">₹</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={pizzaPrices[key]}
                                                        onChange={(e) => setPizzaPrices({ ...pizzaPrices, [key]: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <div className="price-input-wrap">
                                        <span className="price-prefix">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={currentItem.prices}
                                            onChange={(e) => setCurrentItem({ ...currentItem, prices: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-submit">
                                    {editMode ? '✓ Update Item' : '+ Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
