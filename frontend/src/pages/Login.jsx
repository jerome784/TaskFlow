import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      login({ id: 1, name: "Admin User", email: formData.email, role: "ADMIN" }, "mock-jwt-token-123");
      setIsLoading(false);
      navigate("/onboarding"); // Route to onboarding to check purpose
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-vintage-cream text-vintage-charcoal">
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-12">
            <Link to="/" className="font-serif font-bold text-3xl tracking-tight text-vintage-charcoal flex items-center gap-2">
              <span className="text-vintage-gold">⚲</span> TaskFlow
            </Link>
          </div>

          <h1 className="text-4xl font-serif font-bold mb-2">Welcome Back</h1>
          <p className="text-vintage-brown mb-8 text-sm">Sign in to organize your work, beautifully.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-vintage-charcoal mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="vintage-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-vintage-charcoal mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="vintage-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-vintage-brown/30 text-vintage-olive focus:ring-vintage-olive accent-vintage-olive" />
                <span className="text-vintage-brown">Remember me</span>
              </label>
              <a href="#" className="font-medium text-vintage-olive hover:text-vintage-olive/80 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full vintage-btn-primary flex items-center justify-center gap-2 py-3 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-vintage-brown">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-vintage-olive hover:text-vintage-olive/80 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex flex-1 relative bg-vintage-beige border-l border-vintage-brown/20 overflow-hidden items-center justify-center p-12">
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
        
        {/* Vintage Sketch Image */}
        <img 
          src="/assets/vintage_workspace.png" 
          alt="Vintage workspace sketch" 
          className="w-full max-w-lg object-contain rounded-2xl shadow-2xl mix-blend-multiply opacity-90"
        />
        
        <div className="absolute bottom-12 left-12 right-12 text-center">
          <p className="font-serif text-2xl text-vintage-charcoal/80 italic">"Organize Work, Beautifully."</p>
        </div>
      </div>
    </div>
  );
}
