import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/bill', { state: location.state, replace: true });
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem', textAlign: 'center' }}>
            🎉 Congratulations! Your order is confirmed.
        </div>
    );
};

export default OrderConfirmation;
