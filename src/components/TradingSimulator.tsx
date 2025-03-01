
import { useState, useEffect } from "react";
import TradingChart from "./TradingChart";
import { formatCurrency } from "@/lib/utils";

interface TradingSimulatorProps {
  onBalanceChange: (balance: number) => void;
  onSimulationComplete: () => void;
}

const TradingSimulator = ({ onBalanceChange, onSimulationComplete }: TradingSimulatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [balance, setBalance] = useState(20);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [customBetAmount, setCustomBetAmount] = useState("10");

  // Predefined outcomes to ensure user ends with R$500
  const outcomes = [
    { win: false, multiplier: 1 },     // Step 1: Lose
    { win: true, multiplier: 2 },      // Step 2: Win (to keep them engaged)
    { win: false, multiplier: 1.5 },   // Step 3: Lose
    { win: true, multiplier: 3 },      // Step 4: Big win
    { win: true, multiplier: 5 },      // Step 5: Final big win to reach R$500
  ];

  useEffect(() => {
    onBalanceChange(balance);
    
    // End simulation when reaching R$500
    if (balance >= 500) {
      onSimulationComplete();
    }
  }, [balance, onBalanceChange]);

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBetAmount(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= balance) {
      setBetAmount(numValue);
    }
  };

  const placeTrade = (selectedDirection: 'up' | 'down') => {
    if (isTrading || balance < betAmount) return;
    
    setDirection(selectedDirection);
    setIsTrading(true);
    setShowResults(false);
    
    // Simulate trade duration
    setTimeout(() => {
      const currentOutcome = outcomes[currentStep];
      const isCorrect = 
        (selectedDirection === 'up' && currentOutcome.win) || 
        (selectedDirection === 'down' && !currentOutcome.win);
      
      const newResult = isCorrect ? 'win' : 'lose';
      setResult(newResult);
      
      let newBalance = balance;
      if (newResult === 'win') {
        newBalance += betAmount * currentOutcome.multiplier;
      } else {
        newBalance -= betAmount;
      }
      
      setBalance(Math.round(newBalance));
      setShowResults(true);
      
      // Move to next step after showing results
      setTimeout(() => {
        setIsTrading(false);
        setShowResults(false);
        setDirection(null);
        setResult(null);
        
        if (currentStep < outcomes.length - 1) {
          setCurrentStep(prev => prev + 1);
          
          // Suggest increasing bet amount for later stages
          if (currentStep === 1) {
            setBetAmount(prev => Math.min(30, balance / 2));
            setCustomBetAmount("30");
          } else if (currentStep === 3) {
            setBetAmount(prev => Math.min(50, balance / 2));
            setCustomBetAmount("50");
          }
        }
      }, 2000);
    }, 3000);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 md:p-6 shadow-xl border border-gray-800 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Simulador de Trading</h1>
      
      <div className="mb-6">
        <TradingChart 
          currentStep={currentStep} 
          direction={direction}
          result={result}
          isTrading={isTrading}
        />
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-auto">
          <p className="text-gray-400 mb-1 text-sm">Valor da operação</p>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={customBetAmount}
              onChange={handleBetAmountChange}
              min="1"
              max={balance}
              step="1"
              disabled={isTrading}
              className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-24 text-center"
            />
            <span className="text-gray-400 text-sm">/ {formatCurrency(balance)}</span>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={() => placeTrade('up')}
            disabled={isTrading || balance < betAmount}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              isTrading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Alta ↑
          </button>
          
          <button
            onClick={() => placeTrade('down')}
            disabled={isTrading || balance < betAmount}
            className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              isTrading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Baixa ↓
          </button>
        </div>
      </div>
      
      {showResults && (
        <div className={`text-center p-4 rounded-lg mb-4 animate-fade-in ${
          result === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <p className="font-bold text-lg">
            {result === 'win' ? 'Você ganhou!' : 'Você perdeu!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TradingSimulator;
