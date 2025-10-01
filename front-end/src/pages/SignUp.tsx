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
import 'react-phone-number-input/style.css'
//import flags from 'react-phone-number-input/flags'
import { E164Number } from 'libphonenumber-js';
//import PhoneInput from 'react-phone-number-input/input'
import flags from 'react-phone-number-input/flags'
import React, { useId } from "react"
import { ChevronDownIcon, PhoneIcon } from "lucide-react"
import * as RPNInput from "react-phone-number-input"
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { cn } from "@/lib/utils"
import Component from "@/components/Phon";




/**
const PhoneInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      data-slot="phone-input"
      className={cn(
        "-ms-px rounded-s-none shadow-none focus-visible:z-10 border border-gray-600 bg-gray-700",
        className
      )}
      {...props} // <- this is key
    />
  );
}; */


PhoneInput.displayName = "PhoneInput"

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  onChange: (value: RPNInput.Country) => void
  options: { label: string; value: RPNInput.Country | undefined }[]
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country)
  }

  return (
    <div className="border-input border border-gray-600 bg-gray-700 text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0 border border-gray-600 bg-gray-700"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  )
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={16} aria-hidden="true" />
      )}
    </span>
  )
}







const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [address, setAddress] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("")
  const navigate = useNavigate();
  const id = useId()
  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();
  const [phone, setPhone] = useState('');
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
      phone,
      address,
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

            {/*  <div className="*:not-first:mt-2" dir="ltr">
      <Label htmlFor={id}>PhoneIcon number input</Label>
      <RPNInput.default
        className="flex rounded-md shadow-xs border border-gray-600 bg-gray-700"
        international
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        id={id}
        placeholder="Enter phone number"
        value={value as E164Number | undefined}
        onChange={(newValue) => setValue(newValue ?? "")}
      />
      <p
        className="text-muted-foreground mt-2 text-xs"
        role="region"
        aria-live="polite"
      >
        Built with{" "}
        <a
          className="hover:text-foreground underline"
          href="https://gitlab.com/catamphetamine/react-phone-number-input"
          target="_blank"
          rel="noopener nofollow"
        >
          react-phone-number-input
        </a>
      </p>
    </div>*/}

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Address*
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="address"
                  name="address"
                  type={"text"}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-600 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />

              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Phone*
              </Label>
              <div className="mt-1 relative">
                <PhoneInput
                  country={'us'}
                  value={phone}
                  onChange={setPhone}
                  inputProps={{
                    name: 'phone',
                    required: true,
                    autoFocus: false
                  }}
                  containerClass="phone-input-container"
                  inputClass="phone-input-field"
                  buttonClass="phone-input-button"
                  dropdownClass="phone-input-dropdown"
                  containerStyle={{
                    width: '100%',
                  }}
                  buttonStyle={{
                    backgroundColor: '#374151', // gray-700
                    border: '1px solid #4b5563', // gray-600
                    borderTopLeftRadius: '0.375rem',
                    borderBottomLeftRadius: '0.375rem',
                  }}
                  inputStyle={{
                    backgroundColor: '#374151', // gray-700
                    border: '1px solid #4b5563', // gray-600
                    borderRadius: '0.375rem',
                    color: '#ffffff',
                    width: '100%',
                    height: '42px',
                    fontSize: '14px',
                    paddingLeft: '48px',
                  }}
                  dropdownStyle={{
                    backgroundColor: '#374151', // gray-700
                    border: '1px solid #4b5563',
                    color: '#ffffff',
                  }}
                  searchStyle={{
                    backgroundColor: '#1f2937', // gray-800
                    border: '1px solid #4b5563',
                    color: '#ffffff',
                    padding: '8px',
                  }}
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






