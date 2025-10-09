import React from 'react';

const MetricCard = ({ icon: Icon, title, value, subtitle, color = "#3b82f6" }) => (
  <div className="metric-card" style={{ borderLeftColor: color }}>
    <div className="metric-card-content">
      <div className="metric-card-text">
        <p>{title}</p>
        <p className="metric-card-value">{value}</p>
        {subtitle && <p className="metric-card-subtitle">{subtitle}</p>}
      </div>
      <Icon className="metric-card-icon" size={32} />
    </div>
  </div>
);

export default MetricCard;