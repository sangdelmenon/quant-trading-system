# Quantitative Trading System

A React-based quantitative trading dashboard for backtesting algorithmic trading strategies, visualising market data, and analysing portfolio performance metrics.

## Features

- **Strategy Backtesting** — run and evaluate trading strategies on historical data
- **Market Data Visualisation** — candlestick charts, volume, and technical indicators
- **Portfolio Analytics** — P&L tracking, drawdown analysis, and performance metrics
- **Interactive UI** — configure strategies and view results in real time

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Build for production
npm run build
```

## Project Structure

```
src/
├── components/    # React UI components
├── strategies/    # Trading strategy implementations
├── data/          # Market data fetching and processing
└── utils/         # Helper functions and calculations
public/            # Static assets
```

## Tech Stack

- **Framework**: React
- **Language**: JavaScript
- **Charts**: Recharts / Chart.js
- **Styling**: CSS Modules
