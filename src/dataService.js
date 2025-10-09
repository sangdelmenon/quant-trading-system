import axios from 'axios';

// Using Yahoo Finance API alternative (free, no API key needed)
const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v8/finance/chart';

export const fetchStockData = async (symbol, range = '1y', interval = '1d') => {
  try {
    const url = `${YAHOO_FINANCE_API}/${symbol}?range=${range}&interval=${interval}`;
    const response = await axios.get(url);
    
    const data = response.data.chart.result[0];
    const timestamps = data.timestamp;
    const prices = data.indicators.quote[0];
    
    return timestamps.map((time, i) => ({
      date: new Date(time * 1000).toISOString().split('T')[0],
      [symbol]: prices.close[i],
      volume: prices.volume[i],
      open: prices.open[i],
      high: prices.high[i],
      low: prices.low[i]
    }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

export const fetchMultipleStocks = async (symbols, range = '1y') => {
  const promises = symbols.map(symbol => fetchStockData(symbol, range));
  const results = await Promise.all(promises);
  
  // Merge data by date
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
  
  return Object.values(mergedData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
};