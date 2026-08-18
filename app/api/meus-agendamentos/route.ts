import { prisma } from "@/lib/prisma";

interface AppointmentRequest {
  phone?: string;
  bookingCode?: string;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function normalizeBookingCode(code: string) {
  return code.trim().toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as AppointmentRequest;

    const phone = body.phone
      ? normalizePhone(body.phone)
      : "";

    const bookingCode = body.bookingCode
      ? normalizeBookingCode(body.bookingCode)
      : "";

    if (!phone || !bookingCode) {
      return Response.json(
        {
          error:
            "Informe o WhatsApp e o código do agendamento.",
        },
        {
          status: 400,
        },
      );
    }

    const appointment =
      await prisma.appointment.findFirst({
        where: {
          phone,
          bookingCode,
        },
        include: {
          barber: true,
          service: true,
        },
      });

    if (!appointment) {
      return Response.json(
        {
          error:
            "Agendamento não encontrado. Confira o WhatsApp e o código.",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({
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
    });
  } catch (error) {
    console.error(
      "Erro ao consultar agendamento:",
      error,
    );

    return Response.json(
      {
        error:
          "Não foi possível consultar o agendamento.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body =
      (await request.json()) as AppointmentRequest;

    const phone = body.phone
      ? normalizePhone(body.phone)
      : "";

    const bookingCode = body.bookingCode
      ? normalizeBookingCode(body.bookingCode)
      : "";

    if (!phone || !bookingCode) {
      return Response.json(
        {
          error:
            "Informe o WhatsApp e o código do agendamento.",
        },
        {
          status: 400,
        },
      );
    }

    const appointment =
      await prisma.appointment.findFirst({
        where: {
          phone,
          bookingCode,
        },
      });

    if (!appointment) {
      return Response.json(
        {
          error: "Agendamento não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    if (appointment.status === "CANCELLED") {
      return Response.json(
        {
          error:
            "Este agendamento já está cancelado.",
        },
        {
          status: 400,
        },
      );
    }

    if (appointment.status === "COMPLETED") {
      return Response.json(
        {
          error:
            "Um atendimento concluído não pode ser cancelado.",
        },
        {
          status: 400,
        },
      );
    }

    const cancelledAppointment =
      await prisma.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          status: "CANCELLED",
          slotKey: null,
        },
        include: {
          barber: true,
          service: true,
        },
      });

    return Response.json({
      message: "Agendamento cancelado com sucesso.",
      appointment: {
        id: cancelledAppointment.id,
        bookingCode:
          cancelledAppointment.bookingCode,
        clientName:
          cancelledAppointment.clientName,
        phone: cancelledAppointment.phone,
        email: cancelledAppointment.email,
        date: cancelledAppointment.date,
        time: cancelledAppointment.time,
        status: cancelledAppointment.status,
        barber: cancelledAppointment.barber.name,
        service:
          cancelledAppointment.service.name,
        duration:
          cancelledAppointment.service.duration,
        price: cancelledAppointment.service.price,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao cancelar agendamento:",
      error,
    );

    return Response.json(
      {
        error:
          "Não foi possível cancelar o agendamento.",
      },
      {
        status: 500,
      },
    );
  }
}