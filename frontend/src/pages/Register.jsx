import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth";
import { apiErrorMessage } from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "DEVELOPER" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const auth = await authApi.register(formData);
      login(auth.user, auth.token);
      navigate("/onboarding"); // Critical: force onboarding route
    } catch (err) {
      setError(apiErrorMessage(err, "Unable to create account."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-vintage-cream text-vintage-charcoal">
      {/* Left Image Side */}
      <div className="hidden lg:flex flex-1 relative bg-vintage-beige border-r border-vintage-brown/20 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
        
        <img 
          src="/assets/vintage_workspace.png" 
          alt="Vintage workspace sketch" 
          className="w-full max-w-lg object-contain rounded-2xl shadow-2xl mix-blend-multiply opacity-90 scale-x-[-1]"
        />
        
        <div className="absolute bottom-12 left-12 right-12 text-center">
          <p className="font-serif text-2xl text-vintage-charcoal/80 italic">"Design your day, beautifully."</p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-12">
            <Link to="/" className="font-serif font-bold text-3xl tracking-tight text-vintage-charcoal flex items-center gap-2">
              <span className="text-vintage-gold">⚲</span> TaskFlow
            </Link>
          </div>

          <h1 className="text-4xl font-serif font-bold mb-2">Join TaskFlow</h1>
          <p className="text-vintage-brown mb-8 text-sm">Create an account to start organizing your life.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-vintage-charcoal mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="vintage-input"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-vintage-charcoal mb-1">
                Role
              </label>
              <select
                className="vintage-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="DEVELOPER">Developer</option>
                <option value="MANAGER">Manager</option>
                {formData.email.toLowerCase() === "jerinjerome22@gmail.com" && (
                  <option value="ADMIN">Admin</option>
                )}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full vintage-btn-primary flex items-center justify-center gap-2 py-3 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-vintage-brown">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-vintage-olive hover:text-vintage-olive/80 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
