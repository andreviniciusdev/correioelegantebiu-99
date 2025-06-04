const Header = () => {
  return (
    <header className="glass-effect border-b border-pink-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-2 py-2">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <img 
              src="/logocorreioelegante.png" 
              alt="Logo Correio Elegante Escolar" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
