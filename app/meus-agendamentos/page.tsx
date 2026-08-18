"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Appointment = {
  id: string;
  bookingCode: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  date: string;
  time: string;
  price: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  barber: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
};

const statusLabels = {
  PENDING: "Aguardando confirmação",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

function formatDate(date: string) {
  const datePart = date.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
 }).format(Number(price) / 100);
}

export default function MyAppointmentsPage() {
  const [phone, setPhone] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function searchAppointment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");
    setAppointment(null);

    try {
      const response = await fetch(
        "/api/meus-agendamentos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            bookingCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Não foi possível encontrar o agendamento."
        );
        return;
      }

      setAppointment(data.appointment);
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível consultar o agendamento. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment() {
    if (!appointment) {
      return;
    }

    const confirmed = window.confirm(
      "Tem certeza de que deseja cancelar este agendamento?"
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/meus-agendamentos",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            bookingCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Não foi possível cancelar o agendamento."
        );
        return;
      }

      setAppointment(data.appointment);
      setMessage(
        data.message ??
          "Agendamento cancelado com sucesso."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível cancelar o agendamento. Tente novamente."
      );
    } finally {
      setCancelling(false);
    }
  }

  function clearSearch() {
    setAppointment(null);
    setPhone("");
    setBookingCode("");
    setError("");
    setMessage("");
  }

  return (
    <main className="customer-appointments-page">
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

      <section className="customer-appointments-wrap shell">
        <div className="booking-title">
          <p className="eyebrow center">
            <span aria-hidden="true" />
            ÁREA DO CLIENTE
            <span aria-hidden="true" />
          </p>

          <h1>
            Seus <em>agendamentos.</em>
          </h1>

          <p>
            Consulte ou cancele seu horário usando o WhatsApp
            e o código recebido no agendamento.
          </p>
        </div>

        {!appointment ? (
          <div className="lookup-card">
            <div className="lookup-intro">
              <p className="eyebrow">
                <span aria-hidden="true" />
                CONSULTAR RESERVA
              </p>

              <h2>Encontre seu horário</h2>

              <p>
                Digite o mesmo número de WhatsApp informado
                durante a reserva e o seu código de
                agendamento.
              </p>
            </div>

            <form
              className="lookup-form"
              onSubmit={searchAppointment}
            >
              <label htmlFor="customer-phone">
                WHATSAPP
              </label>

              <input
                id="customer-phone"
                type="tel"
                placeholder="Exemplo: 11999999999"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />

              <label htmlFor="booking-code">
                CÓDIGO DO AGENDAMENTO
              </label>

              <input
                id="booking-code"
                type="text"
                placeholder="Exemplo: MN-8F4K2"
                value={bookingCode}
                onChange={(event) =>
                  setBookingCode(
                    event.target.value.toUpperCase()
                  )
                }
                required
              />

              {error && (
                <p className="form-error">{error}</p>
              )}

              <button
                className="button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Consultando..."
                  : "Consultar agendamento"}

                <i aria-hidden="true">↗</i>
              </button>
            </form>
          </div>
        ) : (
          <div className="appointment-result">
            <div className="result-header">
              <div>
                <p className="eyebrow">
                  <span aria-hidden="true" />
                  RESERVA ENCONTRADA
                </p>

                <h2>Olá, {appointment.clientName}.</h2>

                <p>
                  Confira abaixo os detalhes do seu
                  atendimento.
                </p>
              </div>

              <span
                className={`result-status status-${appointment.status.toLowerCase()}`}
              >
                {statusLabels[appointment.status]}
              </span>
            </div>

            <div className="result-code">
              <small>CÓDIGO DA RESERVA</small>
              <strong>{appointment.bookingCode}</strong>
            </div>

            <div className="result-grid">
              <div>
                <small>SERVIÇO</small>
                <strong>
                  {appointment.service.name}
                </strong>
              </div>

              <div>
                <small>ESPECIALISTA</small>
                <strong>
                  {appointment.barber.name}
                </strong>
              </div>

              <div>
                <small>DATA</small>
                <strong>
                  {formatDate(appointment.date)}
                </strong>
              </div>

              <div>
                <small>HORÁRIO</small>
                <strong>{appointment.time}</strong>
              </div>

              <div>
                <small>DURAÇÃO</small>
                <strong>
                  {appointment.service.duration} minutos
                </strong>
              </div>

              <div>
                <small>VALOR</small>
                <strong>
                  {formatPrice(
                    appointment.price ??
                      appointment.service.price
                  )}
                </strong>
              </div>
            </div>

            {message && (
              <p className="form-success">{message}</p>
            )}

            {error && (
              <p className="form-error">{error}</p>
            )}

            <div className="result-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={clearSearch}
              >
                Fazer outra consulta
              </button>

              {appointment.status !== "CANCELLED" &&
                appointment.status !== "COMPLETED" && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={cancelAppointment}
                    disabled={cancelling}
                  >
                    {cancelling
                      ? "Cancelando..."
                      : "Cancelar agendamento"}
                  </button>
                )}
            </div>
          </div>
        )}

        <div className="customer-help">
          <p>Não encontrou sua reserva?</p>

          <a
            href="https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20ajuda%20com%20meu%20agendamento."
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com a barbearia pelo WhatsApp →
          </a>
        </div>
      </section>
    </main>
  );
}