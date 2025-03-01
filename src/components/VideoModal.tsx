
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 p-0 max-w-4xl w-full mx-auto rounded-xl overflow-hidden">
        <div className="p-4 bg-black text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="block">FAÇA 500 REAIS ENQUANTO ASSISTE, OU EU</span>
            <span className="block">SOU OBRIGADO A <span className="bg-yellow-400 text-black px-2 font-extrabold">TE ENVIAR 1.000 REAIS DO</span></span>
            <span className="block">MEU BOLSO</span>
          </h2>
        </div>
        
        <div className="overflow-hidden rounded-lg">
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
          <script 
            type="text/javascript" 
            id="scr_67c1e8ac4916cbb478b01d98" 
            dangerouslySetInnerHTML={{ 
              __html: `var s=document.createElement("script"); s.src="https://scripts.converteai.net/d205677e-a24a-4ad8-9343-877343d335d0/players/67c1e8ac4916cbb478b01d98/player.js", s.async=!0,document.head.appendChild(s);` 
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
