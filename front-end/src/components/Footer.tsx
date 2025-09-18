const Footer = () => {
    return (
      <footer className="bg-slate-800 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-slate-100">TradeMax</span>
            </div>
            
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              TradeMax is a leading online trading platform offering access to global financial markets. 
              Trade with confidence using our advanced tools and secure infrastructure.
            </p>
            
           
            
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-xs">
                © 2025 TradeMax. All rights reserved. Trading involves risk and may not be suitable for all investors.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;