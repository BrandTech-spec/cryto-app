import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username.",
        variant: "destructive",
      });
      return;
    }

    if (!passcode.trim()) {
      toast({
        title: "Passcode Required",
        description: "Please enter a passcode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username.trim(),
            passcode: passcode.trim()
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account.",
        });
        navigate("/signin");
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            {/* OANDA Logo Recreation */}
            <div className="flex flex-col">
              <div className="flex items-end gap-0.5 mb-1">
                <div className="w-2 h-6 bg-green-500 transform -skew-x-12"></div>
                <div className="w-2 h-8 bg-green-500 transform -skew-x-12"></div>
                <div className="w-2 h-4 bg-green-500 transform -skew-x-12"></div>
              </div>
              <div className="w-8 h-1 bg-green-500"></div>
            </div>
            <div className="text-2xl font-bold text-white">OANDA</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-8">SMARTER TRADING</div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address*
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username*
              </Label>
              <div className="mt-1">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password*
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="passcode" className="block text-sm font-medium text-gray-300">
                Passcode*
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="passcode"
                  name="passcode"
                  type={showPasscode ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasscode(!showPasscode)}
                >
                  {showPasscode ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password*
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Get Started"}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Sign In
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center space-y-2">
            <Link
              to="/login-help"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Login Help
            </Link>
            <span className="text-gray-500 text-sm mx-2">·</span>
            <Link
              to="/contact"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;