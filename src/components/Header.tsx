import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { Menu } from "lucide-react";
interface HeaderProps {
  balance: number;
}
const Header = ({
  balance
}: HeaderProps) => {
  const [animatedBalance, setAnimatedBalance] = useState(balance);

  // Animate balance changes
  useEffect(() => {
    if (balance === animatedBalance) return;
    const step = balance > animatedBalance ? 1 : -1;
    const timeout = setTimeout(() => {
      setAnimatedBalance(prev => {
        const diff = Math.abs(balance - prev);
        const increment = Math.max(Math.ceil(diff / 10), 1) * step;
        return diff < Math.abs(increment) ? balance : prev + increment;
      });
    }, 20);
    return () => clearTimeout(timeout);
  }, [balance, animatedBalance]);
  return <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg md:text-xl">
          <Menu className="w-6 h-6 -ml-9" />
        </div>
        <div className="bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 shadow-sm text-sm -mr-9">
          <span className="text-gray-400 mr-1">Saldo:</span>
          <span className={`font-bold ${animatedBalance > 20 ? 'text-green-500' : animatedBalance < 20 ? 'text-red-500' : 'text-white'}`}>
            {formatCurrency(animatedBalance)}
          </span>
        </div>
      </div>
    </header>;
};
export default Header;