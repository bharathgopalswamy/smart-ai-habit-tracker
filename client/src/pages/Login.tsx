import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("habitiq_token", response.data.token);
      localStorage.setItem("habitiq_user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-400 mb-6">
          Login to continue your habit journey.
        </p>

        <input
          required
          className="w-full mb-4 p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          required
          className="w-full mb-6 p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-400 text-black p-4 rounded-2xl font-semibold hover:bg-cyan-300 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-400 text-sm mt-5">
          No account?{" "}
          <Link to="/register" className="text-cyan-400">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}