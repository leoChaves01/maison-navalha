export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string | number>;
    if (!body.name || !body.phone || !body.date || !body.service || !body.barber || !body.time) {
      return Response.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
    }
    return Response.json({ ok: true, appointment: body }, { status: 201 });
  } catch {
    return Response.json({ error: "Não foi possível realizar o agendamento." }, { status: 500 });
  }
}
