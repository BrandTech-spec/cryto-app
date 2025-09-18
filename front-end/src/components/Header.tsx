import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-slate-100">TradeMax</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
              Quick start
            </a>
            <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
              Free demo
            </a>
            <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
              About us
            </a>
            <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
              Blog
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <select className="bg-transparent text-slate-200 border border-slate-600 rounded px-3 py-1">
              <option className="bg-slate-800">English</option>
            </select>
            <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
              Log In
            </Button>
            <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
              Registration
            </Button>
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
              <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
                Quick start
              </a>
              <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
                Free demo
              </a>
              <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
                About us
              </a>
              <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
                Blog
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                  Log In
                </Button>
                <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
                  Registration
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;