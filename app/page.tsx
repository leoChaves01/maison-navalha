import Link from "next/link";

const services = [
  {
    icon: "✦",
    name: "Corte Signature",
    description:
      "Consultoria, corte, lavagem e finalização.",
    price: "R$ 85",
  },
  {
    icon: "⌁",
    name: "Barba Imperial",
    description:
      "Toalha quente, ritual de óleos e acabamento.",
    price: "R$ 65",
  },
  {
    icon: "◇",
    name: "Experiência Maison",
    description:
      "Corte, barba, sobrancelha e cuidado facial.",
    price: "R$ 165",
  },
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
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

        <nav aria-label="Navegação principal">
          <a href="#experiencia">A experiência</a>
          <a href="#servicos">Serviços</a>
          <a href="#equipe">Especialistas</a>
        </nav>

        <div className="nav-actions">
          <Link
            className="client-area-link"
            href="/agendamento"
          >
            Área do cliente
          </Link>

          <Link
            className="admin-login-link"
            href="/login"
          >
            <span className="login-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            Entrar
          </Link>

          <Link
            className="button button-small"
            href="/agendamento"
          >
            Agendar horário
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true" />
            ALFAIATARIA MASCULINA DESDE 2014
          </p>

          <h1>
            Seu estilo,
            <br />
            <em>elevado à arte.</em>
          </h1>

          <p className="lead">
            Mais que um corte. Um ritual de precisão,
            cuidado e personalidade criado para homens
            que valorizam cada detalhe.
          </p>

          <div className="hero-actions">
            <Link
              className="button"
              href="/agendamento"
            >
              Reservar experiência
              <i aria-hidden="true">↗</i>
            </Link>

            <a
              className="text-link"
              href="#servicos"
            >
              Conhecer serviços
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="social-proof">
            <div
              className="avatars"
              aria-hidden="true"
            >
              <span>RM</span>
              <span>LC</span>
              <span>GA</span>
            </div>

            <div>
              <strong>
                4.9 <span>★★★★★</span>
              </strong>

              <small>
                Mais de 1.200 clientes atendidos
              </small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="barber-portrait">
            <div className="portrait-lines" />

            <div
              className="monogram"
              aria-hidden="true"
            >
              M<span>✦</span>N
            </div>
          </div>

          <div className="floating-card">
            <span>PRÓXIMO HORÁRIO</span>

            <strong>Consulte a agenda</strong>

            <small>
              Escolha o profissional e o serviço
            </small>

            <Link href="/agendamento">
              Reservar agora →
            </Link>
          </div>

          <p className="vertical">
            EXCELÊNCIA · TRADIÇÃO · IDENTIDADE
          </p>
        </div>
      </section>

      <section
        className="statement"
        id="experiencia"
      >
        <p className="eyebrow center">
          <span aria-hidden="true" />
          NOSSA ESSÊNCIA
          <span aria-hidden="true" />
        </p>

        <h2>
          Tradição no gesto.
          <br />
          <em>Contemporaneidade no olhar.</em>
        </h2>

        <p>
          Acreditamos que cuidar de si é uma forma de
          presença. Por isso, cada atendimento é
          exclusivo, sem pressa e pensado nos seus
          traços.
        </p>
      </section>

      <section
        className="services shell"
        id="servicos"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span aria-hidden="true" />
              CURADORIA DE SERVIÇOS
            </p>

            <h2>
              Rituais para o
              <br />
              <em>homem contemporâneo.</em>
            </h2>
          </div>

          <Link
            className="text-link"
            href="/agendamento"
          >
            Ver todos os serviços
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <article key={service.name}>
              <div className="service-top">
                <span
                  className="service-icon"
                  aria-hidden="true"
                >
                  {service.icon}
                </span>

                <small>
                  {String(index + 1).padStart(2, "0")}
                </small>
              </div>

              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <div>
                <strong>{service.price}</strong>

                <Link
                  href="/agendamento"
                  aria-label={`Agendar ${service.name}`}
                >
                  ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="team-band"
        id="equipe"
      >
        <div className="shell team-content">
          <div>
            <p className="eyebrow">
              <span aria-hidden="true" />
              MESTRES DA CASA
            </p>

            <h2>
              Precisão nas mãos.
              <br />
              <em>Escuta no processo.</em>
            </h2>
          </div>

          <div className="team-list">
            <div>
              <strong>Rafael Monteiro</strong>
              <small>
                Barbeiro master · 12 anos
              </small>
            </div>

            <div>
              <strong>Lucas Carvalho</strong>
              <small>
                Especialista em visagismo
              </small>
            </div>

            <div>
              <strong>Gabriel Alves</strong>
              <small>Barba e grooming</small>
            </div>
          </div>
        </div>
      </section>

      <section className="access-section">
        <div className="shell access-content">
          <div>
            <p className="eyebrow">
              <span aria-hidden="true" />
              ACESSO RÁPIDO
            </p>

            <h2>
              Escolha como deseja
              <br />
              <em>acessar a Maison.</em>
            </h2>
          </div>

          <div className="access-options">
            <article>
              <span className="access-number">
                01
              </span>

              <h3>Sou cliente</h3>

              <p>
                Escolha o serviço, o barbeiro, a data e
                o horário do seu atendimento.
              </p>

              <Link
                className="button"
                href="/agendamento"
              >
                Fazer agendamento
                <i aria-hidden="true">↗</i>
              </Link>
            </article>

            <article>
              <span className="access-number">
                02
              </span>

              <h3>Sou administrador</h3>

              <p>
                Acesse o painel para confirmar, concluir
                e cancelar os agendamentos.
              </p>

              <Link
                className="button admin-access-button"
                href="/login"
              >
                Entrar no painel
                <i aria-hidden="true">↗</i>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <footer className="shell">
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

        <p>
          Rua Bela Cintra, 1210 · Jardins, São Paulo
          <br />
          Terça a sábado, das 09h às 20h
        </p>

        <div className="footer-actions">
          <Link
            className="footer-admin-link"
            href="/login"
          >
            Área administrativa
          </Link>

          <Link
            className="button"
            href="/agendamento"
          >
            Agendar meu horário
          </Link>
        </div>
      </footer>

      <a
        className="whatsapp-button"
        href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20um%20horário."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a Maison Navalha pelo WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M16.04 3C9.41 3 4.02 8.38 4.02 15c0 2.11.55 4.17 1.59 5.98L3.5 28.7l7.91-2.08A12 12 0 1 0 16.04 3Zm0 21.8c-1.75 0-3.46-.47-4.95-1.36l-.36-.22-4.69 1.23 1.25-4.57-.24-.37A9.78 9.78 0 1 1 16.04 24.8Zm5.37-7.33c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.64.07-1.73-.86-2.86-1.54-4-3.5-.3-.52.3-.48.86-1.6.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.48-.49-.66-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.01-1.04 2.47s1.07 2.87 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.74-.71 1.99-1.4.25-.68.25-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z"
          />
        </svg>

        <span>Fale conosco</span>
      </a>
    </main>
  );
}