import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import tradingDashboard from "@/assets/trading-dashboard.png";
import { useSignIn } from "@/lib/query/api";
import { Link, useNavigate } from "react-router-dom";
import { validateSignUpData } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const HeroSection = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const signInMutation = useSignIn();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !password) {
      toast.error("check your entries")
    }
    const formData = {
      email,
      password,
    };
    if (validateSignUpData(formData)) {

      try {
        await signInMutation.mutateAsync(formData);
        // Handle successful signup (e.g., redirect to dashboard)
        console.log('Account created successfully');
      } catch (error) {
        console.error('Signup failed:', error);
        // Handle signup error
      } finally {
      }
    }
  };

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
            <div className="bg-slate-800 border  rounded-xl p-6 d">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-100">Registration</h3>
                <Link to={'/signup'}>
                  <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                    Sign Up
                  </Button>
                </Link>

              </div>

              <form className="space-y-4 w-[400px]">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="bg-slate-900 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />

                

                <Button onClick={(e) => handleSignIn(e)} variant="default" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 font-semibold">
                  {
                    signInMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In'
                  }
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