import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/explore", label: "Explore", icon: "🌌" },
    { path: "/quiz", label: "Quiz", icon: "🧠" },
    { path: "/quiz-dashboard", label: "Dashboard", icon: "📊" },
    { path: "/definitions", label: "Definitions", icon: "📖" },
    { path: "/blogs", label: "Blogs", icon: "�" },
  ];

  return (
    <nav className="bg-space-dark/90 backdrop-blur-sm border-b border-space-blue/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/AstroPlay Logo.png"
              alt="AstroPlay Logo"
              className="h-44 w-auto max-w-none"
            />
            
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-space-blue text-white"
                    : "text-gray-300 hover:text-white hover:bg-space-blue/50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
