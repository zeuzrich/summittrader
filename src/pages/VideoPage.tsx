
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VideoPage = () => {
  const navigate = useNavigate();

  // Add a back button handler
  const handleBackClick = () => {
    navigate("/");
  };

  // Handle script injection for the video
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/d205677e-a24a-4ad8-9343-877343d335d0/players/67c1e8ac4916cbb478b01d98/player.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header balance={500} />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="bg-gray-900 rounded-xl p-4 md:p-6 shadow-xl border border-gray-800 animate-fade-in max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handleBackClick}
              className="text-gray-400 hover:text-white flex items-center gap-1"
            >
              ← Voltar
            </button>
          </div>
          
          <div className="p-4 bg-black text-white text-center rounded-t-xl">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="block">FAÇA 500 REAIS ENQUANTO ASSISTE, OU EU</span>
              <span className="block">SOU OBRIGADO A <span className="bg-yellow-400 text-black px-2 font-extrabold">TE ENVIAR 1.000 REAIS DO</span></span>
              <span className="block">MEU BOLSO</span>
            </h2>
          </div>
          
          <div className="overflow-hidden rounded-xl">
            <div id="vid_67c1e8ac4916cbb478b01d98" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }}>
              <img 
                id="thumb_67c1e8ac4916cbb478b01d98" 
                src="https://images.converteai.net/d205677e-a24a-4ad8-9343-877343d335d0/players/67c1e8ac4916cbb478b01d98/thumbnail.jpg" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '0.5rem' }} 
                alt="thumbnail" 
              />
              <div 
                id="backdrop_67c1e8ac4916cbb478b01d98" 
                style={{ WebkitBackdropFilter: 'blur(5px)', backdropFilter: 'blur(5px)', position: 'absolute', top: 0, height: '100%', width: '100%', borderRadius: '0.5rem' }}
              ></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoPage;
