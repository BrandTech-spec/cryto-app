import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSignIn, useSignUp } from "@/lib/query/api";
import { toast } from "sonner";
import { validateSignUpData } from "@/lib/utils";

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

  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();

  // utils/referral.ts

  /** Characters used in the random suffix (A-Z, 0-9) */
  const DEFAULT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  /** Returns an uppercase random string of given length using cryptographically secure RNG */
  function randomString(length: number, alphabet = DEFAULT_ALPHABET): string {
    if (typeof window !== "undefined" && (window.crypto as any)?.getRandomValues) {
      // browser
      const arr = new Uint8Array(length);
      window.crypto.getRandomValues(arr);
      const chars = new Array(length);
      for (let i = 0; i < length; i++) {
        chars[i] = alphabet[arr[i] % alphabet.length];
      }
      return chars.join("");
    } else {
      // Node (crypto)
      // dynamic import to avoid bundler issues in browser
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require("crypto");
      const bytes = crypto.randomBytes(length);
      const chars = new Array(length);
      for (let i = 0; i < length; i++) {
        chars[i] = alphabet[bytes[i] % alphabet.length];
      }
      return chars.join("");
    }
  }


  function generateReferral(options?: {
    prefix?: string;
    year?: number | string;
    suffixLength?: number;
    alphabet?: string;
    separator?: string;
  }): string {
    const {
      prefix = "CRYPTO",
      year = new Date().getFullYear(),
      suffixLength = 2,
      alphabet = DEFAULT_ALPHABET,
      separator = "",
    } = options ?? {};

    const suffix = randomString(Math.max(1, Math.floor(suffixLength)), alphabet);
    return `${String(prefix).toUpperCase()}${separator}${String(year)}${suffix}`;
  }

  const handleSignUp = async (e: React.FormEvent) => {

    const formData = {
      email,
      password,
      username,
      passcode,
      referal_code: generateReferral()
    }

    console.log(formData);

    e.preventDefault();
    setIsLoading(true);



    try {

      const sign_up = await signUpMutation.mutateAsync(formData);

      if (!sign_up) {
        return toast.error("failed to create an account please try again")
      }

      const sign_in = await signInMutation.mutateAsync(formData);

      if (!sign_in) {
        return toast.error("failed to create an account please try again")
      }

      navigate("/buy")

      // Handle successful signup (e.g., redirect to dashboard)
      console.log('Account created successfully');
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup error
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center px-3 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
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
        <div className="text-center">
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow rounded-xl sm:rounded-lg sm:px-10 border border-gray-700">
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
              <Label htmlFor="passcode" className="block text-sm font-medium text-gray-300">
                Invitation Code*
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