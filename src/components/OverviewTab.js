import React from 'react';
import MetricCard from './MetricCard'
import { TrendingUp, Activity, AlertTriangle, BarChart3 } from 'lucide-react';

const OverviewTab = ({ metrics, trades }) => (
  <div className="content-section">
    <div className="metric-grid">
      <MetricCard
        icon={TrendingUp}
        title="Total Return"
        value={`${metrics.totalReturn.toFixed(2)}%`}
        subtitle={`Annualized: ${metrics.annualizedReturn.toFixed(2)}%`}
        color="#10b981"
      />
      <MetricCard
        icon={Activity}
        title="Sharpe Ratio"
        value={metrics.sharpeRatio.toFixed(2)}
        subtitle={`Sortino: ${metrics.sortinoRatio.toFixed(2)}`}
        color="#3b82f6"
      />
      <MetricCard
        icon={AlertTriangle}
        title="Max Drawdown"
        value={`${metrics.maxDrawdown.toFixed(2)}%`}
        subtitle={`Volatility: ${metrics.volatility.toFixed(2)}%`}
        color="#ef4444"
      />
      <MetricCard
        icon={BarChart3}
        title="Win Rate"
        value={`${metrics.winRate.toFixed(1)}%`}
        subtitle={`${trades.length} trades`}
        color="#8b5cf6"
      />
    </div>

    <div className="white-card">
      <h2 className="section-title">Strategy Overview</h2>
      <div className="two-col-grid">
        <div>
          <h3 className="subsection-title">Strategy Type</h3>
          <p className="text-small">Statistical Arbitrage - Pairs Trading</p>
          
          <h3 className="subsection-title-mt">Assets</h3>
          <p className="text-small">AAPL vs MSFT (Technology Sector)</p>
          
          <h3 className="subsection-title-mt">Entry Signals</h3>
          <p className="text-small">Z-score threshold: ±2.0 standard deviations</p>
          
          <h3 className="subsection-title-mt">Exit Signals</h3>
          <p className="text-small">Mean reversion to ±0.5 standard deviations</p>
        </div>
        <div>
          <h3 className="subsection-title">Risk Management</h3>
          <ul className="text-list">
            <li>• Value at Risk (95%): {metrics.var95.toFixed(2)}%</li>
            <li>• Value at Risk (99%): {metrics.var99.toFixed(2)}%</li>
            <li>• Position sizing: Equal-weighted spread</li>
            <li>• Maximum holding period: Mean reversion</li>
          </ul>
          
          <h3 className="subsection-title-mt">Key Features</h3>
          <ul className="text-list">
            <li>• Cointegration-based pair selection</li>
            <li>• Dynamic beta hedging</li>
            <li>• Rolling risk metrics</li>
            <li>• Technical indicator overlay</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default OverviewTab;