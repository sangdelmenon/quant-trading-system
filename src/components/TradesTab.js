import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TradesTab = ({ trades }) => (
  <div className="content-section">
    <div className="white-card">
      <h2 className="section-title">Trade Log</h2>
      <div className="table-container">
        <table className="trade-table">
          <thead>
            <tr>
              <th>Entry Date</th>
              <th>Exit Date</th>
              <th>Duration</th>
              <th>Type</th>
              <th>P&L (%)</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, idx) => (
              <tr key={idx}>
                <td>{trade.entry}</td>
                <td>{trade.exit}</td>
                <td>{trade.duration} days</td>
                <td>
                  <span className={`trade-type-badge ${trade.type === 'Long' ? 'trade-type-long' : 'trade-type-short'}`}>
                    {trade.type}
                  </span>
                </td>
                <td className={trade.pnl > 0 ? 'pnl-positive' : 'pnl-negative'}>
                  {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="two-col-grid">
      <div className="white-card">
        <h2 className="section-title">Trade Statistics</h2>
        <div className="space-y-3">
          <div className="stat-row">
            <span className="stat-label">Total Trades</span>
            <span className="stat-value">{trades.length}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Winning Trades</span>
            <span className="stat-value color-green">
              {trades.filter(t => t.pnl > 0).length}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Losing Trades</span>
            <span className="stat-value color-red">
              {trades.filter(t => t.pnl < 0).length}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Avg Duration</span>
            <span className="stat-value">
              {(trades.reduce((sum, t) => sum + t.duration, 0) / trades.length).toFixed(1)} days
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Avg Win</span>
            <span className="stat-value color-green">
              {trades.filter(t => t.pnl > 0).length > 0 
                ? (trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / trades.filter(t => t.pnl > 0).length).toFixed(2)
                : '0.00'}%
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Avg Loss</span>
            <span className="stat-value color-red">
              {trades.filter(t => t.pnl < 0).length > 0
                ? (trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / trades.filter(t => t.pnl < 0).length).toFixed(2)
                : '0.00'}%
            </span>
          </div>
        </div>
      </div>

      <div className="white-card">
        <h2 className="section-title">P&L Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trades.map((t, i) => ({ trade: i + 1, pnl: t.pnl }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trade" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="pnl" fill="#3b82f6" name="P&L (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default TradesTab;