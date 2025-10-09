import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SignalsTab = ({ performanceData }) => (
  <div className="content-section">
    <div className="white-card">
      <h2 className="section-title">Spread Z-Score & Positions</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: 'Z-Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="zScore" stroke="#3b82f6" strokeWidth={2} name="Z-Score" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="white-card">
      <h2 className="section-title">Position History</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[-1.5, 1.5]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="position" fill="#3b82f6" name="Position" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-small mt-2">
        Position: +1 (Long Spread), -1 (Short Spread), 0 (No Position)
      </p>
    </div>

    <div className="white-card">
      <h2 className="section-title">Signal Generation Logic</h2>
      <div className="space-y-4">
        <div className="signal-box signal-box-blue">
          <h3>Entry Conditions</h3>
          <p>Long Spread: Z-score &lt; -2.0 (Spread undervalued)</p>
          <p>Short Spread: Z-score &gt; +2.0 (Spread overvalued)</p>
        </div>
        <div className="signal-box signal-box-green">
          <h3>Exit Conditions</h3>
          <p>Close Long: Z-score rises above -0.5</p>
          <p>Close Short: Z-score falls below +0.5</p>
        </div>
        <div className="signal-box signal-box-gray">
          <h3>Position Sizing</h3>
          <p>Equal dollar amounts, hedged by cointegration beta</p>
          <p>Maximum 1 position at a time</p>
        </div>
      </div>
    </div>
  </div>
);

export default SignalsTab;