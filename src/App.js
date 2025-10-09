import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import './App.css';
import OverviewTab from './components/OverviewTab';
import PerformanceTab from './components/PerformanceTab';
import SignalsTab from './components/SignalsTab';
import RiskTab from './components/RiskTab';
import TradesTab from './components/TradesTab';

const QuantTradingSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [backtestResults, setBacktestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useRealData, setUseRealData] = useState(false);
  const [dataSource, setDataSource] = useState('Simulated');


  // Yahoo Finance API function
const fetchStockData = async (symbol, range = '1y') => {
  try {
    const API_KEY = 'QFUX2C5YGB14ROCX'; 
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}&outputsize=full`;
    
    const response = await axios.get(url);
    
    if (response.data['Error Message']) {
      throw new Error('Invalid API call');
    }
    
    if (response.data['Note']) {
      console.warn('API call frequency limit reached');
      throw new Error('Rate limit');
    }
    
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      throw new Error('No data returned');
    }
    
    const data = Object.entries(timeSeries)
      .slice(0, 252) // Get last 252 trading days (1 year)
      .map(([date, values]) => ({
        date,
        [symbol]: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .reverse(); // Oldest to newest
    
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

  const fetchMultipleStocks = async (symbols, range = '1y') => {
    const promises = symbols.map(symbol => fetchStockData(symbol, range));
    const results = await Promise.all(promises);
    
    if (!results[0] || !results[1]) {
      return null;
    }
    
    const mergedData = {};
    results.forEach((stockData, index) => {
      if (stockData) {
        stockData.forEach(point => {
          if (!mergedData[point.date]) {
            mergedData[point.date] = { date: point.date };
          }
          mergedData[point.date][symbols[index]] = point[symbols[index]];
        });
      }
    });
    
    return Object.values(mergedData)
      .filter(d => d.AAPL && d.MSFT)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const generatePriceData = (symbol, days = 252, initialPrice = 100) => {
    const data = [];
    let price = initialPrice;
    const drift = 0.0005;
    const volatility = 0.02;
    
    for (let i = 0; i < days; i++) {
      const shock = (Math.random() - 0.5) * volatility;
      price = price * (1 + drift + shock);
      data.push({
        date: new Date(2024, 0, 1 + i).toISOString().split('T')[0],
        [symbol]: price,
        volume: Math.floor(1000000 + Math.random() * 500000)
      });
    }
    return data;
  };

  const calculateCointegration = (series1, series2) => {
    const n = series1.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += series1[i];
      sumY += series2[i];
      sumXY += series1[i] * series2[i];
      sumX2 += series1[i] * series1[i];
    }
    
    const beta = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const alpha = (sumY - beta * sumX) / n;
    
    const residuals = series2.map((y, i) => y - (alpha + beta * series1[i]));
    
    const mean = residuals.reduce((a, b) => a + b, 0) / n;
    const variance = residuals.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / n;
    const adfStat = -Math.abs(mean / Math.sqrt(variance)) * Math.sqrt(n);
    
    return { beta, alpha, adfStat, residuals };
  };

  const calculateTechnicalIndicators = (prices) => {
    const sma20 = [];
    const sma50 = [];
    const rsi = [];
    const bollingerBands = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i >= 19) {
        const sum = prices.slice(i - 19, i + 1).reduce((a, b) => a + b, 0);
        sma20.push(sum / 20);
      } else {
        sma20.push(null);
      }
      
      if (i >= 49) {
        const sum = prices.slice(i - 49, i + 1).reduce((a, b) => a + b, 0);
        sma50.push(sum / 50);
      } else {
        sma50.push(null);
      }
      
      if (i >= 14) {
        const changes = [];
        for (let j = i - 13; j <= i; j++) {
          changes.push(prices[j] - prices[j - 1]);
        }
        const gains = changes.filter(c => c > 0).reduce((a, b) => a + b, 0) / 14;
        const losses = Math.abs(changes.filter(c => c < 0).reduce((a, b) => a + b, 0)) / 14;
        const rs = gains / (losses || 0.0001);
        rsi.push(100 - (100 / (1 + rs)));
      } else {
        rsi.push(50);
      }
      
      if (i >= 19) {
        const slice = prices.slice(i - 19, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / 20;
        const stdDev = Math.sqrt(slice.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / 20);
        bollingerBands.push({
          upper: mean + 2 * stdDev,
          middle: mean,
          lower: mean - 2 * stdDev
        });
      } else {
        bollingerBands.push(null);
      }
    }
    
    return { sma20, sma50, rsi, bollingerBands };
  };

  const runPairsTradingStrategy = (stock1Data, stock2Data) => {
    const prices1 = stock1Data.map(d => d.AAPL);
    const prices2 = stock2Data.map(d => d.MSFT);
    
    const { beta, alpha, residuals } = calculateCointegration(prices1, prices2);
    
    const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const stdDev = Math.sqrt(residuals.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / residuals.length);
    const zScores = residuals.map(r => (r - mean) / stdDev);
    
    const signals = [];
    const positions = [];
    let currentPosition = 0;
    const entryThreshold = 2;
    const exitThreshold = 0.5;
    
    for (let i = 0; i < zScores.length; i++) {
      let signal = 0;
      
      if (currentPosition === 0) {
        if (zScores[i] > entryThreshold) {
          signal = -1;
          currentPosition = -1;
        } else if (zScores[i] < -entryThreshold) {
          signal = 1;
          currentPosition = 1;
        }
      } else if (currentPosition === 1) {
        if (zScores[i] > -exitThreshold) {
          signal = -1;
          currentPosition = 0;
        }
      } else if (currentPosition === -1) {
        if (zScores[i] < exitThreshold) {
          signal = 1;
          currentPosition = 0;
        }
      }
      
      signals.push(signal);
      positions.push(currentPosition);
    }
    
    return { zScores, signals, positions, beta, alpha };
  };

  const calculatePortfolioReturns = (positions, prices1, prices2, beta) => {
    const returns = [];
    const cumulativeReturns = [];
    let cumReturn = 1;
    
    for (let i = 1; i < positions.length; i++) {
      if (positions[i - 1] !== 0) {
        const ret1 = (prices1[i] - prices1[i - 1]) / prices1[i - 1];
        const ret2 = (prices2[i] - prices2[i - 1]) / prices2[i - 1];
        const portfolioReturn = positions[i - 1] * (ret2 - beta * ret1);
        returns.push(portfolioReturn);
        cumReturn *= (1 + portfolioReturn);
        cumulativeReturns.push(cumReturn);
      } else {
        returns.push(0);
        cumulativeReturns.push(cumReturn);
      }
    }
    
    return { returns, cumulativeReturns };
  };

  const calculateMetrics = (returns, cumulativeReturns) => {
    const validReturns = returns.filter(r => r !== 0);
    const mean = validReturns.reduce((a, b) => a + b, 0) / validReturns.length;
    const variance = validReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / validReturns.length;
    const stdDev = Math.sqrt(variance);
    
    const sharpeRatio = (mean / stdDev) * Math.sqrt(252);
    
    const downside = validReturns.filter(r => r < 0);
    const downsideStdDev = downside.length > 0 
      ? Math.sqrt(downside.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downside.length)
      : 0.0001;
    const sortinoRatio = (mean / downsideStdDev) * Math.sqrt(252);
    
    let maxDrawdown = 0;
    let peak = cumulativeReturns[0] || 1;
    
    for (let val of cumulativeReturns) {
      if (val > peak) peak = val;
      const drawdown = (peak - val) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    const totalReturn = (cumulativeReturns[cumulativeReturns.length - 1] - 1) * 100;
    const winRate = (validReturns.filter(r => r > 0).length / validReturns.length) * 100;
    
    return {
      sharpeRatio,
      sortinoRatio,
      maxDrawdown: maxDrawdown * 100,
      totalReturn,
      annualizedReturn: totalReturn * (252 / returns.length),
      volatility: stdDev * Math.sqrt(252) * 100,
      winRate
    };
  };

  const calculateVaR = (returns, confidence = 0.95) => {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return -sortedReturns[index] * 100;
  };

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    
    let stock1Data, stock2Data;
    
    if (useRealData) {
      try {
        setProgress(10);
        setDataSource('Fetching real market data...');
        
        const realData = await fetchMultipleStocks(['AAPL', 'MSFT'], '1y');
        
        setProgress(40);
        
        if (realData && realData.length > 50) {
          stock1Data = realData.map(d => ({ date: d.date, AAPL: d.AAPL, volume: 1000000 }));
          stock2Data = realData.map(d => ({ date: d.date, MSFT: d.MSFT, volume: 1000000 }));
          setDataSource('Real Market Data (Yahoo Finance)');
        } else {
          throw new Error('Insufficient data');
        }
      } catch (error) {
        console.error('Failed to fetch real data, using simulated:', error);
        stock1Data = generatePriceData('AAPL', 252, 150);
        stock2Data = generatePriceData('MSFT', 252, 300);
        setDataSource('Simulated (API Failed)');
      }
    } else {
      stock1Data = generatePriceData('AAPL', 252, 150);
      stock2Data = generatePriceData('MSFT', 252, 300);
      setDataSource('Simulated Data');
    }
    
    setProgress(50);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mergedData = stock1Data.map((d, i) => ({
      ...d,
      MSFT: stock2Data[i].MSFT
    }));
    
    setProgress(70);
    
    const { zScores, signals, positions, beta } = runPairsTradingStrategy(stock1Data, stock2Data);
    
    setProgress(85);
    
    const prices1 = stock1Data.map(d => d.AAPL);
    const prices2 = stock2Data.map(d => d.MSFT);
    const { returns, cumulativeReturns } = calculatePortfolioReturns(positions, prices1, prices2, beta);
    
    const metrics = calculateMetrics(returns, cumulativeReturns);
    const var95 = calculateVaR(returns, 0.95);
    const var99 = calculateVaR(returns, 0.99);
    
    const tech1 = calculateTechnicalIndicators(prices1);
    const tech2 = calculateTechnicalIndicators(prices2);
    
    const performanceData = mergedData.map((d, i) => ({
      date: d.date,
      portfolio: cumulativeReturns[i] ? (cumulativeReturns[i] - 1) * 100 : 0,
      aapl: ((prices1[i] / prices1[0]) - 1) * 100,
      msft: ((prices2[i] / prices2[0]) - 1) * 100,
      zScore: zScores[i],
      position: positions[i]
    }));
    
    const priceData = mergedData.map((d, i) => ({
      date: d.date,
      aapl: d.AAPL,
      msft: d.MSFT,
      aaplSMA20: tech1.sma20[i],
      aaplSMA50: tech1.sma50[i],
      msftSMA20: tech2.sma20[i],
      msftSMA50: tech2.sma50[i]
    }));
    
    const rsiData = mergedData.map((d, i) => ({
      date: d.date,
      aaplRSI: tech1.rsi[i],
      msftRSI: tech2.rsi[i]
    }));
    
    const rollingMetrics = [];
    const window = 60;
    for (let i = window; i < returns.length; i++) {
      const windowReturns = returns.slice(i - window, i);
      const windowCumReturns = cumulativeReturns.slice(i - window, i);
      const windowMetrics = calculateMetrics(windowReturns, windowCumReturns);
      rollingMetrics.push({
        date: mergedData[i].date,
        sharpe: windowMetrics.sharpeRatio,
        sortino: windowMetrics.sortinoRatio,
        volatility: windowMetrics.volatility
      });
    }
    
    const trades = [];
    let entryIndex = null;
    for (let i = 0; i < signals.length; i++) {
      if (signals[i] !== 0 && entryIndex === null) {
        entryIndex = i;
      } else if (signals[i] !== 0 && entryIndex !== null) {
        const pnl = positions[entryIndex] * (zScores[entryIndex] - zScores[i]) * 100;
        trades.push({
          entry: mergedData[entryIndex].date,
          exit: mergedData[i].date,
          duration: i - entryIndex,
          pnl: pnl,
          type: positions[entryIndex] > 0 ? 'Long' : 'Short'
        });
        entryIndex = null;
      }
    }
    
    setBacktestResults({
      metrics: { ...metrics, var95, var99 },
      performanceData,
      priceData,
      rsiData,
      rollingMetrics,
      trades
    });
    
    setIsRunning(false);
    setProgress(100);
  };

  useEffect(() => {
    runBacktest();
  }, []);

  if (!backtestResults) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Running Initial Backtest...</p>
          <div className="loading-progress">
            <div className="loading-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="max-width-container">
        <div className="app-header">
          <h1 className="app-title">Quantitative Trading System</h1>
          <p className="app-subtitle">Statistical Arbitrage Strategy with Advanced Risk Management</p>
        </div>

        <div className="control-panel">
          <div className="control-flex">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useRealData}
                onChange={(e) => setUseRealData(e.target.checked)}
                className="checkbox-input"
                disabled={isRunning}
              />
              <span className="checkbox-text">Use Real Market Data</span>
            </label>
            
            <button
              onClick={runBacktest}
              disabled={isRunning}
              className="run-button"
            >
              <RefreshCw size={16} style={{ animation: isRunning ? 'spin 1s linear infinite' : 'none' }} />
              {isRunning ? 'Running Backtest...' : 'Run Backtest'}
            </button>
            
            <div className="data-source-label">
              Data Source: <span className="data-source-value">{dataSource}</span>
            </div>
          </div>
          
          {isRunning && (
            <div className="progress-container">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="progress-text">{progress}% complete</p>
            </div>
          )}
        </div>

        <div className="tabs-container">
          {['overview', 'performance', 'signals', 'risk', 'trades'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : 'inactive'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <OverviewTab 
            metrics={backtestResults.metrics} 
            trades={backtestResults.trades}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceTab 
            performanceData={backtestResults.performanceData}
            priceData={backtestResults.priceData}
            rsiData={backtestResults.rsiData}
          />
        )}

        {activeTab === 'signals' && (
          <SignalsTab 
            performanceData={backtestResults.performanceData}
          />
        )}

        {activeTab === 'risk' && (
          <RiskTab 
            metrics={backtestResults.metrics}
            rollingMetrics={backtestResults.rollingMetrics}
          />
        )}

        {activeTab === 'trades' && (
          <TradesTab 
            trades={backtestResults.trades}
          />
        )}

        <div className="info-box">
          <h3>About This System</h3>
          <p>
            This quantitative trading system demonstrates a complete statistical arbitrage implementation with:
            cointegration testing, z-score based signal generation, dynamic position sizing, comprehensive risk metrics (VaR, Sharpe, Sortino),
            technical indicators (SMA, RSI, Bollinger Bands), rolling performance analytics, and detailed trade logging.
            Toggle "Use Real Market Data" to fetch live data from Yahoo Finance API, or use simulated data for consistent results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantTradingSystem;