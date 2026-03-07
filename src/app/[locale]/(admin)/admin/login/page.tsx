"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-brand-600 tracking-wide">
            ROCAVIVA
          </h1>
          <p className="text-sm text-neutral-500 mt-2">Panel de Administracion</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm border border-neutral-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600 transition-colors"
              placeholder="admin@rocaviva.eu"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white text-sm font-medium tracking-widest uppercase hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
