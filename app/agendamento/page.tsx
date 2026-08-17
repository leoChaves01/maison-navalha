"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface Service {
  name: string;
  duration: string;
  price: number;
}

const services: Service[] = [
  {
    name: "Corte Signature",
    duration: "50 min",
    price: 85,
  },
  {
    name: "Barba Imperial",
    duration: "40 min",
    price: 65,
  },
  {
    name: "Corte + Barba",
    duration: "1h 20 min",
    price: 135,
  },
  {
    name: "Experiência Maison",
    duration: "1h 45 min",
    price: 165,
  },
];

const barbers = [
  "Rafael Monteiro",
  "Lucas Carvalho",
  "Gabriel Alves",
];

const availableTimes = [
  "09:00",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
];

function getCurrentDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  const localDate = new Date(today.getTime() - timezoneOffset);

  return localDate.toISOString().split("T")[0];
}

export default function Booking() {
  const [selectedService, setSelectedService] = useState<Service>(
    services[0],
  );
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [selectedTime, setSelectedTime] = useState("14:30");

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const appointment = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      date: formData.get("date"),
      service: selectedService.name,
      barber: selectedBarber,
      time: selectedTime,
      duration: selectedService.duration,
      price: selectedService.price,
    };

    try {
      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error ?? "Não foi possível realizar o agendamento.",
        );
      }

      setSent(true);
      form.reset();
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
    <main className="booking-page">
      <header className="nav shell booking-nav">
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
          ← Voltar ao início
        </Link>
      </header>

      <div className="booking-wrap shell">
        <div className="booking-title">
          <p className="eyebrow center">
            <span aria-hidden="true" />
            RESERVE SEU MOMENTO
            <span aria-hidden="true" />
          </p>

          <h1>
            Agende sua <em>experiência.</em>
          </h1>

          <p>Escolha cada detalhe. Nós cuidamos do restante.</p>
        </div>

        {sent ? (
          <section className="booking-card success">
            <div>
              <div className="success-mark" aria-hidden="true">
                ✓
              </div>

              <h2>Horário reservado.</h2>

              <p>
                Seu agendamento foi registrado com sucesso.
                <br />
                Enviaremos a confirmação pelo WhatsApp.
              </p>

              <Link href="/" className="button">
                Voltar para o início
              </Link>
            </div>
          </section>
        ) : (
          <section className="booking-card">
            <form
              className="booking-form"
              onSubmit={handleSubmit}
            >
              <div className="steps" aria-hidden="true">
                <span className="active" />
                <span className="active" />
                <span />
              </div>

              <h2>Monte seu atendimento</h2>

              <p className="field-label">
                01 · ESCOLHA O SERVIÇO
              </p>

              <div className="option-grid">
                {services.map((service) => {
                  const isSelected =
                    selectedService.name === service.name;

                  return (
                    <button
                      key={service.name}
                      type="button"
                      className={
                        isSelected
                          ? "option selected"
                          : "option"
                      }
                      aria-pressed={isSelected}
                      onClick={() => setSelectedService(service)}
                    >
                      <strong>{service.name}</strong>

                      <small>
                        {service.duration} · R$ {service.price}
                      </small>
                    </button>
                  );
                })}
              </div>

              <p className="field-label">
                02 · SEU ESPECIALISTA
              </p>

              <div className="option-grid">
                {barbers.map((barber) => {
                  const isSelected =
                    selectedBarber === barber;

                  return (
                    <button
                      key={barber}
                      type="button"
                      className={
                        isSelected
                          ? "option selected"
                          : "option"
                      }
                      aria-pressed={isSelected}
                      onClick={() => setSelectedBarber(barber)}
                    >
                      <strong>{barber}</strong>
                      <small>Especialista Maison</small>
                    </button>
                  );
                })}
              </div>

              <label className="field-label" htmlFor="date">
                03 · DATA E HORÁRIO
              </label>

              <div className="inputs">
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={getCurrentDate()}
                  required
                />
              </div>

              <div className="time-grid">
                {availableTimes.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      className={
                        isSelected
                          ? "time selected"
                          : "time"
                      }
                      aria-pressed={isSelected}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <p className="field-label">
                04 · SEUS DADOS
              </p>

              <div className="inputs">
                <input
                  name="name"
                  type="text"
                  placeholder="Nome completo"
                  aria-label="Nome completo"
                  autoComplete="name"
                  required
                />

                <input
                  name="phone"
                  type="tel"
                  placeholder="WhatsApp"
                  aria-label="WhatsApp"
                  autoComplete="tel"
                  required
                />

                <input
                  className="full"
                  name="email"
                  type="email"
                  placeholder="E-mail (opcional)"
                  aria-label="E-mail"
                  autoComplete="email"
                />
              </div>

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
                  ? "Reservando..."
                  : "Confirmar agendamento"}

                <i aria-hidden="true">↗</i>
              </button>
            </form>

            <aside className="summary">
              <p className="eyebrow">SEU AGENDAMENTO</p>

              <h3>Resumo da experiência</h3>

              <div className="summary-line">
                <small>SERVIÇO</small>
                <strong>{selectedService.name}</strong>
              </div>

              <div className="summary-line">
                <small>ESPECIALISTA</small>
                <strong>{selectedBarber}</strong>
              </div>

              <div className="summary-line">
                <small>HORÁRIO</small>
                <strong>{selectedTime}</strong>
              </div>

              <div className="summary-line">
                <small>DURAÇÃO</small>
                <strong>{selectedService.duration}</strong>
              </div>

              <div className="total">
                <span>Total</span>

                <strong>
                  R$ {selectedService.price}
                </strong>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}