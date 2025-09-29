import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);

    if (newCount === 5) {
      navigate("/otp-email");
    }
  };

  // Reset count every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(0);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  
  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-4">
          <div className="text-center mb-8">
            <div onClick={()=> handleClick() } className="flex items-center justify-center gap-3 mb-4">
              {/* Logo */}
              <div className="flex flex-col">
                <div className="flex items-end gap-0.5 mb-1">
                  <div className="w-2 h-4 bg-green-500 transform -skew-x-12"></div>
                  <div className="w-2 h-6 bg-green-500 transform -skew-x-12"></div>
                  <div className="w-2 h-8 bg-blue-900 transform -skew-x-12"></div>
                </div>
                <div className="w-8 h-1 bg-green-500"></div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white/90">OANDA</h1>
                <p className="text-sm text-gray-600 tracking-wider">SMARTER TRADING</p>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            OANDA is a leading online trading platform offering access to global financial markets.
            Trade with confidence using our advanced tools and secure infrastructure.
          </p>



          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-xs">
              © 2025 OANDA. All rights reserved. Trading involves risk and may not be suitable for all investors.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;