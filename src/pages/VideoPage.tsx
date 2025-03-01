
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VideoPage = () => {
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
      <main className="flex-1">
        <div className="bg-transparent py-6">
          <h2 className="text-xl md:text-2xl font-bold text-center px-4">
            <span className="block">FAÇA 500 REAIS ENQUANTO ASSISTE, OU EU</span>
            <span className="block">SOU OBRIGADO A <span className="bg-orange-500 text-black px-2 font-extrabold">TE ENVIAR 1.000 REAIS DO</span></span>
            <span className="block">MEU BOLSO</span>
          </h2>
        </div>
        
        <div className="w-full max-w-3xl mx-auto px-4">
          <div id="vid_67c1e8ac4916cbb478b01d98" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }} className="rounded-lg overflow-hidden">
            <img 
              id="thumb_67c1e8ac4916cbb478b01d98" 
              src="https://images.converteai.net/d205677e-a24a-4ad8-9343-877343d335d0/players/67c1e8ac4916cbb478b01d98/thumbnail.jpg" 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              alt="thumbnail" 
              className="rounded-lg"
            />
            <div 
              id="backdrop_67c1e8ac4916cbb478b01d98" 
              style={{ WebkitBackdropFilter: 'blur(5px)', backdropFilter: 'blur(5px)', position: 'absolute', top: 0, height: '100%', width: '100%' }}
              className="rounded-lg"
            ></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoPage;
