import { useEffect, useState } from 'react';
import '../styles/topbar.css';

const Topbar = ({ title, subtitle }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="topbar">
            <div className="topbar-left">
                <h3>{title}</h3>
                <p>{subtitle || currentTime.toLocaleString()}</p>
            </div>
            <div className="topbar-right">
                <div className="admin-profile">
                    <div className="admin-avatar">A</div>
                    <div className="admin-info">
                        <span className="admin-name">Admin</span>
                        <span className="admin-role">Administrator</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
