import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-center ">
            <div className="flex items-center justify-center gap-3 mb-4">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">

          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <select className="bg-transparent text-slate-200 border border-slate-600 rounded px-3 py-1">
              <option className="bg-slate-800">English</option>
            </select>
            <Link to={"/signin"}>
              <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                Log In
              </Button>
            </Link>
            <Link to={'/signup'}>
              <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
                Registration
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-200" />
            ) : (
              <Menu className="w-6 h-6 text-slate-200" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <nav className="flex flex-col space-y-4">


              <div className="flex flex-col space-y-2 pt-4">
                <Link to={"/signin"}>
                  <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                    Log In
                  </Button>
                </Link>
                <Link to={'/signup'}>
                  <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
                    Registration
                  </Button>
                </Link>

              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;