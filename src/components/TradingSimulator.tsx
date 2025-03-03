
import { useState, useEffect } from "react";
import TradingChart from "./TradingChart";
import { formatCurrency } from "@/lib/utils";
import { Bitcoin, DollarSign, Gem, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface TradingSimulatorProps {
  onBalanceChange: (balance: number) => void;
  onSimulationComplete: () => void;
}

const TradingSimulator = ({ onBalanceChange, onSimulationComplete }: TradingSimulatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [balance, setBalance] = useState(30);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  const [betAmount, setBetAmount] = useState(30); // Initialize with full balance
  const [showResults, setShowResults] = useState(false);
  const [customBetAmount, setCustomBetAmount] = useState("30"); // Initialize with full balance
  const [currentCrypto, setCurrentCrypto] = useState<'BTC' | 'ETH' | 'SOL'>('BTC');
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const { toast } = useToast();

  // Cryptocurrencies data
  const cryptoData = {
    BTC: { name: 'Bitcoin (BTC-X)', icon: <Bitcoin className="w-5 h-5" /> },
    ETH: { name: 'Ethereum (ETH-X)', icon: <Gem className="w-5 h-5" /> },
    SOL: { name: 'Solana (SOL-X)', icon: <DollarSign className="w-5 h-5" /> }
  };

  // Predefined outcomes - now with 4 steps, losing only on step 2
  const outcomes = [
    { win: true, multiplier: 2 },      // Step 1: Win
    { win: false, multiplier: 1 },     // Step 2: Lose (only loss)
    { win: true, multiplier: 2.5 },    // Step 3: Win
    { win: true, multiplier: 5 },      // Step 4: Final big win to reach R$500
  ];

  // Handle welcome dialog close
  const handleStartTrading = () => {
    setShowWelcomeDialog(false);
  };

  useEffect(() => {
    onBalanceChange(balance);
    
    // End simulation when reaching R$500
    if (balance >= 500) {
      onSimulationComplete();
    }
  }, [balance, onBalanceChange, onSimulationComplete]);

  // Always set bet amount to the current balance
  useEffect(() => {
    setBetAmount(balance);
    setCustomBetAmount(balance.toString());
  }, [balance]);

  // Change cryptocurrency based on the step
  useEffect(() => {
    const cryptos: ('BTC' | 'ETH' | 'SOL')[] = ['BTC', 'ETH', 'SOL', 'BTC'];
    setCurrentCrypto(cryptos[currentStep]);
  }, [currentStep]);

  // Updated to prevent entering values higher than balance
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      // Ensure bet amount doesn't exceed balance
      const validBetAmount = Math.min(numValue, balance);
      setBetAmount(validBetAmount);
      setCustomBetAmount(validBetAmount.toString());
    } else {
      setCustomBetAmount(value);
    }
  };

  // Additional validation when input loses focus
  const handleInputBlur = () => {
    const numValue = parseFloat(customBetAmount);
    if (isNaN(numValue) || numValue <= 0) {
      // Reset to minimum value if invalid
      setBetAmount(1);
      setCustomBetAmount("1");
    } else {
      // Ensure bet amount doesn't exceed balance
      const validBetAmount = Math.min(numValue, balance);
      setBetAmount(validBetAmount);
      setCustomBetAmount(validBetAmount.toString());
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
      
      // For winning stages, make the result match the user's selection
      // For the losing stage (step 2), make the result opposite of user's selection
      let isCorrect = currentOutcome.win;
      
      if (currentOutcome.win) {
        // If this is a winning stage, user always wins regardless of direction
        isCorrect = true;
      } else {
        // If this is a losing stage, user loses but never more than 30% of their balance
        isCorrect = false;
        // Ensure they don't lose too much
        const maxLoss = Math.min(betAmount, balance * 0.3);
        if (betAmount > maxLoss) {
          setBetAmount(maxLoss);
        }
      }
      
      const newResult = isCorrect ? 'win' : 'lose';
      setResult(newResult);
      
      let newBalance = balance;
      if (newResult === 'win') {
        newBalance += betAmount * currentOutcome.multiplier;
      } else {
        // Ensure they don't lose more than 30% of their balance
        const safeLossAmount = Math.min(betAmount, balance * 0.3);
        newBalance -= safeLossAmount;
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
        }
      }, 2000);
    }, 3000);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 md:p-6 shadow-xl border border-gray-800 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        {cryptoData[currentCrypto].icon}
        {cryptoData[currentCrypto].name} Trading
      </h1>
      
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
              onBlur={handleInputBlur}
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

      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Parabéns!</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-lg mb-2">Você recebeu R$30 para operar com criptomoedas.</p>
            <p className="text-gray-400">Comece a operar agora mesmo e multiplique seus ganhos!</p>
          </div>
          <DialogFooter>
            <button 
              onClick={handleStartTrading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Começar <Play className="w-4 h-4" />
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradingSimulator;
