"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

interface Service {
  name: string;
  duration: string;
  price: number;
}

interface BookingConfirmation {
  id: string;
  bookingCode: string;
  clientName: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  status: string;
  barber: string;
  service: string;
  duration: number;
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

const times = [
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
  const offset = today.getTimezoneOffset() * 60_000;
  const localDate = new Date(
    today.getTime() - offset,
  );

  return localDate.toISOString().split("T")[0];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function Booking() {
  const [selectedService, setSelectedService] =
    useState<Service>(services[0]);

  const [selectedBarber, setSelectedBarber] =
    useState(barbers[0]);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [occupiedTimes, setOccupiedTimes] = useState<
    string[]
  >([]);

  const [loadingTimes, setLoadingTimes] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [confirmation, setConfirmation] =
    useState<BookingConfirmation | null>(null);

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAvailableTimes() {
      if (!selectedDate || !selectedBarber) {
        setOccupiedTimes([]);
        return;
      }

      setLoadingTimes(true);
      setError("");

      try {
        const params = new URLSearchParams({
          barber: selectedBarber,
          date: selectedDate,
        });

        const response = await fetch(
          `/api/agendamentos?${params.toString()}`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              "Não foi possível consultar os horários.",
          );
        }

        const occupied: string[] =
          data.occupiedTimes ?? [];

        setOccupiedTimes(occupied);

        setSelectedTime((currentTime) =>
          occupied.includes(currentTime)
            ? ""
            : currentTime,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível consultar os horários.";

        setError(message);
        setOccupiedTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    }

    loadAvailableTimes();
  }, [selectedBarber, selectedDate]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedDate) {
      setError("Escolha uma data.");
      return;
    }

    if (!selectedTime) {
      setError("Escolha um horário disponível.");
      return;
    }

    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const appointment = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      date: selectedDate,
      time: selectedTime,
      barber: selectedBarber,
      service: selectedService.name,
    };

    try {
      const response = await fetch(
        "/api/agendamentos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointment),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Não foi possível realizar o agendamento.",
        );
      }

      setConfirmation(data.appointment);
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

  async function copyBookingCode() {
    if (!confirmation) {
      return;
    }

    await navigator.clipboard.writeText(
      confirmation.bookingCode,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
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

          <p>
            Escolha cada detalhe. Nós cuidamos do
            restante.
          </p>
        </div>

        {confirmation ? (
          <section className="booking-card success">
            <div>
              <div
                className="success-mark"
                aria-hidden="true"
              >
                ✓
              </div>

              <p className="eyebrow center">
                AGENDAMENTO CONFIRMADO
              </p>

              <h2>Horário reservado.</h2>

              <p>
                Seu agendamento foi registrado com
                sucesso.
                <br />
                Guarde o código abaixo para consultar,
                cancelar ou reagendar.
              </p>

              <div className="booking-code-box">
                <small>
                  SEU CÓDIGO DE AGENDAMENTO
                </small>

                <strong>
                  {confirmation.bookingCode}
                </strong>

                <button
                  type="button"
                  onClick={copyBookingCode}
                >
                  {copied
                    ? "Código copiado!"
                    : "Copiar código"}
                </button>
              </div>

              <div className="confirmation-details">
                <div>
                  <small>SERVIÇO</small>

                  <strong>
                    {confirmation.service}
                  </strong>
                </div>

                <div>
                  <small>BARBEIRO</small>

                  <strong>
                    {confirmation.barber}
                  </strong>
                </div>

                <div>
                  <small>DATA</small>

                  <strong>
                    {formatDate(confirmation.date)}
                  </strong>
                </div>

                <div>
                  <small>HORÁRIO</small>

                  <strong>
                    {confirmation.time}
                  </strong>
                </div>
              </div>

              <div className="success-actions">
                <Link
                  href="/meus-agendamentos"
                  className="button"
                >
                  Consultar agendamento
                </Link>

                <Link
                  href="/"
                  className="text-link"
                >
                  Voltar para o início
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="booking-card">
            <form
              className="booking-form"
              onSubmit={handleSubmit}
            >
              <div
                className="steps"
                aria-hidden="true"
              >
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
                    selectedService.name ===
                    service.name;

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
                      onClick={() =>
                        setSelectedService(service)
                      }
                    >
                      <strong>{service.name}</strong>

                      <small>
                        {service.duration} · R${" "}
                        {service.price}
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
                      onClick={() => {
                        setSelectedBarber(barber);
                        setSelectedTime("");
                      }}
                    >
                      <strong>{barber}</strong>

                      <small>
                        Especialista Maison
                      </small>
                    </button>
                  );
                })}
              </div>

              <label
                className="field-label"
                htmlFor="date"
              >
                03 · DATA E HORÁRIO
              </label>

              <div className="inputs">
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={getCurrentDate()}
                  value={selectedDate}
                  required
                  onChange={(event) => {
                    setSelectedDate(
                      event.target.value,
                    );

                    setSelectedTime("");
                  }}
                />
              </div>

              {loadingTimes && (
                <p className="loading-times">
                  Consultando horários disponíveis...
                </p>
              )}

              <div className="time-grid">
                {times.map((time) => {
                  const isOccupied =
                    occupiedTimes.includes(time);

                  const isSelected =
                    selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      className={
                        isSelected
                          ? "time selected"
                          : isOccupied
                            ? "time occupied"
                            : "time"
                      }
                      disabled={
                        !selectedDate ||
                        isOccupied ||
                        loadingTimes
                      }
                      aria-label={
                        isOccupied
                          ? `${time} indisponível`
                          : `${time} disponível`
                      }
                      onClick={() =>
                        setSelectedTime(time)
                      }
                    >
                      {time}

                      {isOccupied && (
                        <small>Ocupado</small>
                      )}
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
                <p
                  className="form-error"
                  role="alert"
                >
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
              <p className="eyebrow">
                SEU AGENDAMENTO
              </p>

              <h3>Resumo da experiência</h3>

              <div className="summary-line">
                <small>SERVIÇO</small>

                <strong>
                  {selectedService.name}
                </strong>
              </div>

              <div className="summary-line">
                <small>ESPECIALISTA</small>

                <strong>{selectedBarber}</strong>
              </div>

              <div className="summary-line">
                <small>DATA</small>

                <strong>
                  {selectedDate
                    ? formatDate(selectedDate)
                    : "Não escolhida"}
                </strong>
              </div>

              <div className="summary-line">
                <small>HORÁRIO</small>

                <strong>
                  {selectedTime || "Não escolhido"}
                </strong>
              </div>

              <div className="summary-line">
                <small>DURAÇÃO</small>

                <strong>
                  {selectedService.duration}
                </strong>
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