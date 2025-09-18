import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import tradingDashboard from "@/assets/trading-dashboard.png";

const HeroSection = () => {
  return (
    <section className="pt-20 pb-12 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight">
                THE RIGHT PLACE
                <br />
                <span className="text-blue-400">FOR ONLINE TRADING</span>
                <br />
                ON FINANCIAL MARKETS
              </h1>
              <div className="space-y-2">
                <p className="text-lg text-slate-300">
                  The most user-friendly interface
                </p>
                <p className="text-lg text-slate-300">
                  Get access to trade over 100 global trading assets
                </p>
              </div>
            </div>

           
          </div>

          {/* Right Content - Registration Form */}
          <div className="lg:max-w-md ml-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl shadow-slate-900/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-100">Registration</h3>
                <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                  Sign In
                </Button>
              </div>

              <form className="space-y-4">
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" className="mt-1 border-slate-600 text-blue-500" />
                  <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                    I have read and accepted the following agreement:{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      Public offer agreement
                    </a>
                  </label>
                </div>

                <Button variant="default" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 font-semibold">
                  Log In
                </Button>

              
              </form>
            </div>
          </div>
        </div>

        {/* Trading Interface Preview */}
      </div>
    </section>
  );
};

export default HeroSection;