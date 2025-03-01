
import { useState } from "react";
import TradingSimulator from "@/components/TradingSimulator";
import VideoModal from "@/components/VideoModal";
import Header from "@/components/Header";

const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(20);
  const [hasCompletedSimulation, setHasCompletedSimulation] = useState(false);

  const handleSimulationComplete = () => {
    setHasCompletedSimulation(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header balance={currentBalance} />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        {hasCompletedSimulation ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-gray-900 p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-800 animate-fade-in">
              <h2 className="text-2xl font-bold mb-4">Parabéns!</h2>
              <p className="mb-6">Você alcançou R$500,00! Para receber seu dinheiro, assista a um vídeo curto.</p>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 w-full"
              >
                Assistir Vídeo
              </button>
            </div>
          </div>
        ) : (
          <TradingSimulator 
            onBalanceChange={setCurrentBalance} 
            onSimulationComplete={handleSimulationComplete}
          />
        )}
      </main>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </div>
  );
};

export default Index;
