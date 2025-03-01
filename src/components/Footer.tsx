
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Summit Trading Simulator. Todos os direitos reservados.
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Este simulador é apenas para fins educacionais. Não constitui orientação financeira.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
