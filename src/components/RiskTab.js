import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskTab = ({ metrics, rollingMetrics }) => (
  <div className="content-section">
    <div className="three-col-grid">
      <div className="white-card">
        <h3 className="subsection-title">Value at Risk</h3>
        <p className="risk-value-large color-red">{metrics.var95.toFixed(2)}%</p>
        <p className="risk-label">95% Confidence</p>
        <p className="risk-value-medium color-red-dark">{metrics.var99.toFixed(2)}%</p>
        <p className="risk-label">99% Confidence</p>
      </div>
      <div className="white-card">
        <h3 className="subsection-title">Volatility Metrics</h3>
        <p className="risk-value-large color-blue">{metrics.volatility.toFixed(2)}%</p>
        <p className="risk-label">Annualized Volatility</p>
        <p className="risk-value-medium color-blue-dark">{metrics.maxDrawdown.toFixed(2)}%</p>
        <p className="risk-label">Maximum Drawdown</p>
      </div>
      <div className="white-card">
        <h3 className="subsection-title">Risk-Adjusted Returns</h3>
        <p className="risk-value-large color-green">{metrics.sharpeRatio.toFixed(2)}</p>
        <p className="risk-label">Sharpe Ratio</p>
        <p className="risk-value-medium color-green-dark">{metrics.sortinoRatio.toFixed(2)}</p>
        <p className="risk-label">Sortino Ratio</p>
      </div>
    </div>

    <div className="white-card">
      <h2 className="section-title">Rolling Risk Metrics (60-day window)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rollingMetrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sharpe" stroke="#3b82f6" strokeWidth={2} name="Rolling Sharpe" dot={false} />
          <Line type="monotone" dataKey="sortino" stroke="#10b981" strokeWidth={2} name="Rolling Sortino" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="white-card">
      <h2 className="section-title">Rolling Volatility</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rollingMetrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: 'Volatility (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="volatility" stroke="#ef4444" strokeWidth={2} name="Volatility" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="white-card">
      <h2 className="section-title">Risk Management Framework</h2>
      <div className="two-col-grid">
        <div>
          <h3 className="subsection-title">Position Limits</h3>
          <ul className="text-list">
            <li>• Maximum position size: 100% of capital per pair</li>
            <li>• Stop-loss: Automatic exit on 2x normal volatility</li>
            <li>• Concentration limit: Single sector exposure</li>
          </ul>
        </div>
        <div>
          <h3 className="subsection-title">Monitoring & Controls</h3>
          <ul className="text-list">
            <li>• Daily VaR calculation at 95% and 99% confidence</li>
            <li>• Real-time correlation monitoring</li>
            <li>• Drawdown alerts at 5%, 10%, 15% thresholds</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default RiskTab;