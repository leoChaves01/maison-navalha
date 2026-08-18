"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Não foi possível entrar.",
        );
      }

      window.location.href = "/admin";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <header className="nav shell login-nav">
        <Link
          className="brand"
          href="/"
          aria-label="Maison Navalha"
        >
          <span>MN</span>

          <div>
            MAISON
            <br />
            <strong>NAVALHA</strong>
          </div>
        </Link>

        <Link className="text-link" href="/">
          ← Voltar ao site
        </Link>
      </header>

      <section className="login-container shell">
        <div className="login-intro">
          <p className="eyebrow">
            <span aria-hidden="true" />
            ÁREA RESTRITA
          </p>

          <h1>
            Gestão da
            <br />
            <em>barbearia.</em>
          </h1>

          <p>
            Acesse o painel para acompanhar, confirmar,
            concluir e cancelar os agendamentos.
          </p>
        </div>

        <div className="login-card">
          <p className="eyebrow">
            ACESSO ADMINISTRATIVO
          </p>

          <h2>Bem-vindo.</h2>

          <p className="login-description">
            Informe suas credenciais para acessar a agenda.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@maisonnavalha.com.br"
              autoComplete="email"
              required
            />

            <label htmlFor="password">Senha</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Entrando..."
                : "Entrar no painel"}

              <i aria-hidden="true">↗</i>
            </button>
          </form>

          <small className="login-help">
            Acesso exclusivo para a equipe Maison Navalha.
          </small>
        </div>
      </section>
    </main>
  );
}