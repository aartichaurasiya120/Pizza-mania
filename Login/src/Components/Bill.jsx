import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../Component/CheckOut.module.css';

const Bill = () => {
    const { state: billData } = useLocation();
    const navigate = useNavigate();

    if (!billData) {
        navigate('/order/Pizza', { replace: true });
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.billCard}>
                <h2 className={styles.billTitle}>🧾 Order Invoice</h2>
                <div className={styles.billSection}>
                    <p><strong>Customer Name:</strong> {billData.customerName}</p>
                    <p><strong>Phone Number:</strong> {billData.phoneNumber}</p>
                    <p><strong>Order Date:</strong> {billData.orderDate}</p>
                </div>
                <div className={styles.billSection}>
                    <h3>Ordered Items:</h3>
                    {billData.items.map((item, index) => (
                        <div key={index} className={styles.billItem}>
                            <span>{item.tittle} (x{item.count})</span>
                            <span>₹{item.prices * item.count}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.billSection}>
                    <div className={styles.billItem}>
                        <span>Subtotal:</span>
                        <span>₹{billData.subtotal}</span>
                    </div>
                    <div className={styles.billItem}>
                        <span>Convenience Fee:</span>
                        <span>₹{billData.convenienceFee}</span>
                    </div>
                    <div className={styles.billItem}>
                        <span>GST (2%):</span>
                        <span>₹{billData.gst}</span>
                    </div>
                    <div className={styles.billItem}>
                        <span>Discount:</span>
                        <span>{billData.discount}</span>
                    </div>
                    <div className={styles.billTotal}>
                        <span>Total Amount:</span>
                        <span>₹{billData.totalPrice}</span>
                    </div>
                </div>
                <button className={styles.downloadBtn} onClick={() => window.print()}>📥 Download Bill</button>
                <button className={styles.backBtn} onClick={() => navigate('/order/Pizza')}>← Back to Menu</button>
            </div>
        </div>
    );
};

export default Bill;
