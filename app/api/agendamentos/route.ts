import { randomInt } from "node:crypto";

import { prisma } from "@/lib/prisma";

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

const bookingCodeCharacters =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

interface AppointmentBody {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  barber?: string;
  service?: string;
  notes?: string;
}

function generateBookingCode() {
  let code = "";

  for (let index = 0; index < 5; index++) {
    const characterIndex = randomInt(
      bookingCodeCharacters.length,
    );

    code += bookingCodeCharacters[characterIndex];
  }

  return `MN-${code}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const barberName = searchParams.get("barber");
    const date = searchParams.get("date");

    if (!barberName || !date) {
      return Response.json(
        {
          error: "Barbeiro e data são obrigatórios.",
        },
        {
          status: 400,
        },
      );
    }

    const barber = await prisma.barber.findFirst({
      where: {
        name: barberName,
        active: true,
      },
    });

    if (!barber) {
      return Response.json(
        {
          error: "Barbeiro não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const appointments =
      await prisma.appointment.findMany({
        where: {
          barberId: barber.id,
          date,
          slotKey: {
            not: null,
          },
          status: {
            not: "CANCELLED",
          },
        },
        select: {
          time: true,
        },
      });

    const occupiedTimes = appointments.map(
      (appointment) => appointment.time,
    );

    return Response.json({
      availableTimes: availableTimes.filter(
        (time) => !occupiedTimes.includes(time),
      ),
      occupiedTimes,
    });
  } catch (error) {
    console.error(
      "Erro ao consultar horários:",
      error,
    );

    return Response.json(
      {
        error:
          "Não foi possível consultar os horários.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as AppointmentBody;

    const name = body.name?.trim();
    const phone = body.phone
      ? normalizePhone(body.phone)
      : "";

    const email =
      body.email?.trim().toLowerCase() || null;

    const date = body.date?.trim();
    const time = body.time?.trim();
    const barberName = body.barber?.trim();
    const serviceName = body.service?.trim();
    const notes = body.notes?.trim() || null;

    if (
      !name ||
      !phone ||
      !date ||
      !time ||
      !barberName ||
      !serviceName
    ) {
      return Response.json(
        {
          error:
            "Preencha todos os campos obrigatórios.",
        },
        {
          status: 400,
        },
      );
    }

    if (phone.length < 10 || phone.length > 13) {
      return Response.json(
        {
          error:
            "Informe um número de WhatsApp válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (!availableTimes.includes(time)) {
      return Response.json(
        {
          error:
            "O horário selecionado não é válido.",
        },
        {
          status: 400,
        },
      );
    }

    const [barber, service] = await Promise.all([
      prisma.barber.findFirst({
        where: {
          name: barberName,
          active: true,
        },
      }),
      prisma.service.findFirst({
        where: {
          name: serviceName,
          active: true,
        },
      }),
    ]);

    if (!barber) {
      return Response.json(
        {
          error: "Barbeiro não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    if (!service) {
      return Response.json(
        {
          error: "Serviço não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const slotKey = `${barber.id}:${date}:${time}`;
    const bookingCode = generateBookingCode();

    const appointment =
      await prisma.appointment.create({
        data: {
          bookingCode,
          clientName: name,
          phone,
          email,
          date,
          time,
          notes,
          slotKey,
          barberId: barber.id,
          serviceId: service.id,
        },
        include: {
          barber: true,
          service: true,
        },
      });

    return Response.json(
      {
        message:
          "Agendamento realizado com sucesso.",
        appointment: {
          id: appointment.id,
          bookingCode: appointment.bookingCode,
          clientName: appointment.clientName,
          phone: appointment.phone,
          email: appointment.email,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          barber: appointment.barber.name,
          service: appointment.service.name,
          duration: appointment.service.duration,
          price: appointment.service.price,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return Response.json(
        {
          error:
            "Esse horário acabou de ser reservado. Escolha outro horário.",
        },
        {
          status: 409,
        },
      );
    }

    console.error(
      "Erro ao criar agendamento:",
      error,
    );

    return Response.json(
      {
        error:
          "Não foi possível realizar o agendamento.",
      },
      {
        status: 500,
      },
    );
  }
}