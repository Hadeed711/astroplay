import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  Compass, 
  Brain, 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  FileText,
  Menu,
  X
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/quiz", label: "Quiz", icon: Brain },
    { path: "/quiz-dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/definitions", label: "Definitions", icon: BookOpen },
    { path: "/blogs", label: "Blogs", icon: FileText },
    { path: "/data-viz", label: "Data Viz", icon: TrendingUp },
  ];

  // Function to check if a nav item should be highlighted
  const isActive = (itemPath) => {
    if (itemPath === "/explore") {
      // Highlight Explore for both "/" and "/explore" paths
      return location.pathname === "/" || location.pathname === "/explore";
    }
    return location.pathname === itemPath;
  };

  return (
    <nav className="bg-space-dark/90 backdrop-blur-sm border-b border-space-blue/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity relative">
            <img
              src="/AstroPlay Logo.png"
              alt="AstroPlay Logo"
              className="h-20 md:h-24 lg:h-28 w-auto max-w-none filter drop-shadow-lg relative z-10"
              style={{ marginTop: '-8px', marginBottom: '-8px' }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-space-blue text-white"
                      : "text-gray-300 hover:text-white hover:bg-space-blue/50"
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-space-blue/50 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-space-dark/95 border-t border-space-blue/20">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-space-blue text-white"
                        : "text-gray-300 hover:text-white hover:bg-space-blue/50"
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
