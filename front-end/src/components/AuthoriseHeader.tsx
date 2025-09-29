import { Button } from "@/components/ui/button";
import { useSignOut } from "@/lib/query/api";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthoriseHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { mutateAsync: deleteSession, isPending } = useSignOut()
    // Mock user state - replace with your actual authentication logic
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    };

    const handleLogout = async () => {
        setIsAuthenticated(false);
        setIsProfileMenuOpen(false);

        try {
            const del = await deleteSession()

            if (del) {
                navigate("/landing")
            }
        } catch (error) {
            console.log(error);
            toast.error("failed to log out")

        }
        // Add your logout logic here
        console.log("User logged out");
    };

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
                        <a href="#" className="text-slate-200 hover:text-blue-400 transition-colors">
                            Blog
                        </a>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <select className="bg-transparent text-slate-200 border border-slate-600 rounded px-3 py-1">
                            <option className="bg-slate-800">English</option>
                        </select>

                        {isAuthenticated ? (
                            // Authenticated user profile section
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 transition-colors"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-500/30"
                                    />
                                    <span className="text-slate-200 text-sm font-medium">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>

                                {/* Profile dropdown menu */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                                        <div className="p-4 border-b border-slate-600">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                                                />
                                                <div>
                                                    <p className="text-slate-200 font-medium">{user.name}</p>
                                                    <p className="text-slate-400 text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <button className="w-full flex items-center space-x-2 px-3 py-2 text-slate-200 hover:bg-slate-700 rounded-md transition-colors">
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Non-authenticated user buttons
                            <>
                                <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                                    Log In
                                </Button>
                                <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
                                    Registration
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-slate-200" />
                        ) : (

                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
                            />

                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-700">
                        <nav className="flex flex-col space-y-4">


                            <div className="flex flex-col space-y-2 pt-4">
                                {isAuthenticated ? (
                                    // Mobile authenticated user section
                                    <>
                                        <Link to={"/profile"} >
                                            <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50">
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            size="sm"
                                            className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    // Mobile non-authenticated user buttons
                                    <>
                                        <Button variant="outline" size="sm" className="border-blue-500/20 bg-slate-800/50 text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/40">
                                            Log In
                                        </Button>
                                        <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm font-semibold">
                                            Registration
                                        </Button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AuthoriseHeader;