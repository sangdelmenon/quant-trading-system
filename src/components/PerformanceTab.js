import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceTab = ({ performanceData, priceData, rsiData }) => (
  <div className="content-section">
    <div className="white-card">
      <h2 className="section-title">Cumulative Returns</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" strokeWidth={2} name="Strategy" dot={false} />
          <Line type="monotone" dataKey="aapl" stroke="#10b981" strokeWidth={1} name="AAPL" dot={false} />
          <Line type="monotone" dataKey="msft" stroke="#8b5cf6" strokeWidth={1} name="MSFT" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="white-card">
      <h2 className="section-title">Price Action with Moving Averages</h2>
      <div className="two-col-grid">
        <div>
          <h3 className="subsection-title">AAPL</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="aapl" stroke="#000" strokeWidth={2} name="Price" dot={false} />
              <Line type="monotone" dataKey="aaplSMA20" stroke="#3b82f6" strokeWidth={1} name="SMA 20" dot={false} />
              <Line type="monotone" dataKey="aaplSMA50" stroke="#ef4444" strokeWidth={1} name="SMA 50" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="subsection-title">MSFT</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="msft" stroke="#000" strokeWidth={2} name="Price" dot={false} />
              <Line type="monotone" dataKey="msftSMA20" stroke="#3b82f6" strokeWidth={1} name="SMA 20" dot={false} />
              <Line type="monotone" dataKey="msftSMA50" stroke="#ef4444" strokeWidth={1} name="SMA 50" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="white-card">
      <h2 className="section-title">RSI Indicators</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rsiData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aaplRSI" stroke="#10b981" strokeWidth={2} name="AAPL RSI" dot={false} />
          <Line type="monotone" dataKey="msftRSI" stroke="#8b5cf6" strokeWidth={2} name="MSFT RSI" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PerformanceTab;