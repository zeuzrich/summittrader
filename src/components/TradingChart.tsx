
import { useEffect, useRef } from 'react';

interface TradingChartProps {
  currentStep: number;
  direction: 'up' | 'down' | null;
  result: 'win' | 'lose' | null;
  isTrading: boolean;
}

const TradingChart = ({ currentStep, direction, result, isTrading }: TradingChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Chart patterns for each step
  const chartPatterns = [
    // Step 1: Downtrend
    {
      initialData: [30, 35, 33, 38, 36, 32, 34, 31, 33, 29],
      tradingData: direction === 'up' ? [28, 26, 24, 25] : [30, 32, 34, 33]
    },
    // Step 2: Uptrend after dip
    {
      initialData: [25, 22, 24, 21, 23, 20, 21, 22, 24, 25],
      tradingData: direction === 'up' ? [27, 29, 31, 33] : [23, 21, 19, 18]
    },
    // Step 3: Choppy then down
    {
      initialData: [30, 32, 31, 33, 32, 34, 33, 35, 33, 34],
      tradingData: direction === 'up' ? [35, 34, 32, 30] : [32, 30, 28, 26]
    },
    // Step 4: Strong uptrend
    {
      initialData: [25, 23, 24, 22, 20, 22, 24, 26, 28, 30],
      tradingData: direction === 'up' ? [32, 34, 37, 40] : [28, 26, 24, 22]
    },
    // Step 5: Final uptrend
    {
      initialData: [30, 32, 34, 36, 38, 40, 38, 40, 42, 44],
      tradingData: direction === 'up' ? [46, 48, 51, 55] : [42, 40, 38, 36]
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Constants for chart
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#2D3748'; // gray-800
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (chartWidth / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, rect.height - padding);
      ctx.stroke();
    }
    
    // Get current pattern
    const pattern = chartPatterns[currentStep];
    if (!pattern) return;
    
    // Combine initial data with trading data if trading
    const data = [...pattern.initialData];
    if (isTrading && direction) {
      data.push(...pattern.tradingData);
    }
    
    // Calculate min and max for scaling
    const min = Math.min(...data) * 0.9;
    const max = Math.max(...data) * 1.1;
    const range = max - min;
    
    // Draw candlesticks
    const candleWidth = chartWidth / (data.length * 2);
    
    data.forEach((value, index) => {
      // For each candle, calculate open, high, low, close
      const open = value;
      const close = data[index + 1] || value + (Math.random() * 2 - 1);
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      
      // Calculate positions
      const x = padding + index * (chartWidth / data.length);
      const yOpen = padding + chartHeight - ((open - min) / range * chartHeight);
      const yClose = padding + chartHeight - ((close - min) / range * chartHeight);
      const yHigh = padding + chartHeight - ((high - min) / range * chartHeight);
      const yLow = padding + chartHeight - ((low - min) / range * chartHeight);
      
      // Draw candle wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth, yHigh);
      ctx.lineTo(x + candleWidth, yLow);
      ctx.strokeStyle = '#718096'; // gray-600
      ctx.stroke();
      
      // Draw candle body
      ctx.fillStyle = close > open ? '#38A169' : '#E53E3E'; // green-600 or red-600
      ctx.fillRect(
        x + candleWidth * 0.5,
        Math.min(yOpen, yClose),
        candleWidth,
        Math.abs(yClose - yOpen) || 1
      );
    });
    
    // Draw arrows for prediction
    if (direction && isTrading) {
      const lastX = padding + (pattern.initialData.length - 0.5) * (chartWidth / data.length);
      const lastY = padding + chartHeight - ((pattern.initialData[pattern.initialData.length - 1] - min) / range * chartHeight);
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(lastX + chartWidth * 0.15, direction === 'up' ? lastY - chartHeight * 0.15 : lastY + chartHeight * 0.15);
      ctx.strokeStyle = '#ECC94B'; // yellow-500
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      if (direction === 'up') {
        ctx.moveTo(lastX + chartWidth * 0.15, lastY - chartHeight * 0.15);
        ctx.lineTo(lastX + chartWidth * 0.13, lastY - chartHeight * 0.13);
        ctx.lineTo(lastX + chartWidth * 0.17, lastY - chartHeight * 0.13);
      } else {
        ctx.moveTo(lastX + chartWidth * 0.15, lastY + chartHeight * 0.15);
        ctx.lineTo(lastX + chartWidth * 0.13, lastY + chartHeight * 0.13);
        ctx.lineTo(lastX + chartWidth * 0.17, lastY + chartHeight * 0.13);
      }
      ctx.closePath();
      ctx.fillStyle = '#ECC94B'; // yellow-500
      ctx.fill();
    }
    
    // Draw result arrow if trade is completed
    if (result && !isTrading) {
      const lastCandle = data.length - 1;
      const lastX = padding + lastCandle * (chartWidth / data.length);
      const beforeLastY = padding + chartHeight - ((data[lastCandle - 1] - min) / range * chartHeight);
      const lastY = padding + chartHeight - ((data[lastCandle] - min) / range * chartHeight);
      
      ctx.beginPath();
      ctx.moveTo(lastX - chartWidth * 0.1, beforeLastY);
      ctx.lineTo(lastX + chartWidth * 0.1, lastY);
      ctx.strokeStyle = '#ECC94B'; // yellow-500
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      if (lastY < beforeLastY) {
        ctx.moveTo(lastX + chartWidth * 0.1, lastY);
        ctx.lineTo(lastX + chartWidth * 0.08, lastY + chartHeight * 0.02);
        ctx.lineTo(lastX + chartWidth * 0.12, lastY + chartHeight * 0.02);
      } else {
        ctx.moveTo(lastX + chartWidth * 0.1, lastY);
        ctx.lineTo(lastX + chartWidth * 0.08, lastY - chartHeight * 0.02);
        ctx.lineTo(lastX + chartWidth * 0.12, lastY - chartHeight * 0.02);
      }
      ctx.closePath();
      ctx.fillStyle = '#ECC94B'; // yellow-500
      ctx.fill();
    }
    
  }, [currentStep, direction, result, isTrading]);

  return (
    <div className="relative bg-gray-950 rounded-xl border border-gray-800 shadow-inner overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[300px] md:h-[400px]"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default TradingChart;
