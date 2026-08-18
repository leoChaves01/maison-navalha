import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AppointmentStatus,
} from "@/app/generated/prisma/client";
import {
  deleteAdminSession,
  getAdminSession,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const validStatuses: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
}

async function updateAppointmentStatus(
  formData: FormData,
) {
  "use server";

  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const appointmentId = String(
    formData.get("appointmentId") ?? "",
  );

  const requestedStatus = String(
    formData.get("status") ?? "",
  ) as AppointmentStatus;

  if (
    !appointmentId ||
    !validStatuses.includes(requestedStatus)
  ) {
    return;
  }

  const appointment =
    await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

  if (!appointment) {
    return;
  }

  if (appointment.status === "CANCELLED") {
    return;
  }

  await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: requestedStatus,
      slotKey:
        requestedStatus === "CANCELLED"
          ? null
          : appointment.slotKey,
    },
  });

  revalidatePath("/admin");
}

async function logout() {
  "use server";

  await deleteAdminSession();
  redirect("/login");
}

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const appointments =
    await prisma.appointment.findMany({
      include: {
        barber: true,
        service: true,
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          time: "asc",
        },
      ],
    });

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "PENDING",
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) =>
      appointment.status === "CONFIRMED",
  ).length;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED",
  ).length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="brand admin-brand">
            <span>MN</span>

            <div>
              MAISON
              <br />
              <strong>NAVALHA</strong>
            </div>
          </div>

          <div className="admin-header-actions">
            <div>
              <small>USUÁRIO CONECTADO</small>
              <strong>{session.email}</strong>
            </div>

            <form action={logout}>
              <button
                className="admin-logout"
                type="submit"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">
              <span aria-hidden="true" />
              PAINEL ADMINISTRATIVO
            </p>

            <h1>
              Agenda da <em>Maison.</em>
            </h1>

            <p>
              Acompanhe e gerencie todos os atendimentos
              da barbearia.
            </p>
          </div>

          <a
            className="button"
            href="/agendamento"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir agendamento ↗
          </a>
        </div>

        <div className="admin-stats">
          <article>
            <small>TOTAL DE AGENDAMENTOS</small>
            <strong>{appointments.length}</strong>
          </article>

          <article>
            <small>AGUARDANDO CONFIRMAÇÃO</small>
            <strong>{pendingCount}</strong>
          </article>

          <article>
            <small>CONFIRMADOS</small>
            <strong>{confirmedCount}</strong>
          </article>

          <article>
            <small>CONCLUÍDOS</small>
            <strong>{completedCount}</strong>
          </article>
        </div>

        <div className="admin-section-title">
          <div>
            <p className="eyebrow">
              <span aria-hidden="true" />
              ATENDIMENTOS
            </p>

            <h2>Todos os agendamentos</h2>
          </div>

          <span>
            {appointments.length} registro
            {appointments.length === 1 ? "" : "s"}
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="admin-empty">
            <span>◇</span>
            <h2>Nenhum agendamento.</h2>
            <p>
              Os novos agendamentos aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <article
                className="appointment-card"
                key={appointment.id}
              >
                <div className="appointment-date">
                  <small>DATA E HORÁRIO</small>

                  <strong>
                    {formatDate(appointment.date)}
                  </strong>

                  <span>{appointment.time}</span>
                </div>

                <div className="appointment-client">
                  <small>CLIENTE</small>

                  <strong>
                    {appointment.clientName}
                  </strong>

                  <a
                    href={`https://wa.me/55${appointment.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {appointment.phone}
                  </a>

                  {appointment.email && (
                    <span>{appointment.email}</span>
                  )}
                </div>

                <div className="appointment-details">
                  <small>ATENDIMENTO</small>

                  <strong>
                    {appointment.service.name}
                  </strong>

                  <span>
                    {appointment.barber.name}
                  </span>

                  <b>
                    {formatPrice(
                      appointment.service.price,
                    )}
                  </b>
                </div>

                <div className="appointment-status">
                  <small>STATUS</small>

                  <span
                    className={`status-badge status-${appointment.status.toLowerCase()}`}
                  >
                    {statusLabels[appointment.status]}
                  </span>
                </div>

                <div className="appointment-actions">
                  {appointment.status === "PENDING" && (
                    <form
                      action={updateAppointmentStatus}
                    >
                      <input
                        type="hidden"
                        name="appointmentId"
                        value={appointment.id}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value="CONFIRMED"
                      />

                      <button
                        className="admin-action confirm"
                        type="submit"
                      >
                        Confirmar
                      </button>
                    </form>
                  )}

                  {appointment.status ===
                    "CONFIRMED" && (
                    <form
                      action={updateAppointmentStatus}
                    >
                      <input
                        type="hidden"
                        name="appointmentId"
                        value={appointment.id}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value="COMPLETED"
                      />

                      <button
                        className="admin-action complete"
                        type="submit"
                      >
                        Concluir
                      </button>
                    </form>
                  )}

                  {appointment.status !== "CANCELLED" &&
                    appointment.status !==
                      "COMPLETED" && (
                      <form
                        action={
                          updateAppointmentStatus
                        }
                      >
                        <input
                          type="hidden"
                          name="appointmentId"
                          value={appointment.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="CANCELLED"
                        />

                        <button
                          className="admin-action cancel"
                          type="submit"
                        >
                          Cancelar
                        </button>
                      </form>
                    )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}