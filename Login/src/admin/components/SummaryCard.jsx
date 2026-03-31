const SummaryCard = ({ icon, title, value, isPositive }) => {
    return (
        <div className="summary-card">
            <div className="card-icon">{icon}</div>
            <div className="card-title">{title}</div>
            <div className={`card-value ${isPositive === true ? 'positive' : isPositive === false ? 'negative' : ''}`}>
                {value}
            </div>
        </div>
    );
};

export default SummaryCard;
