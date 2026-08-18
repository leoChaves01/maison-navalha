import {
  createAdminSession,
  validateAdminCredentials,
} from "@/lib/auth";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;

    const email = body.email
      ?.trim()
      .toLowerCase();

    const password = body.password?.trim();

    if (!email || !password) {
      return Response.json(
        {
          error: "Informe o e-mail e a senha.",
        },
        {
          status: 400,
        },
      );
    }

    const validCredentials =
      validateAdminCredentials(email, password);

    if (!validCredentials) {
      return Response.json(
        {
          error: "E-mail ou senha incorretos.",
        },
        {
          status: 401,
        },
      );
    }

    await createAdminSession(email);

    return Response.json({
      message: "Login realizado com sucesso.",
    });
  } catch (error) {
    console.error(
      "Erro ao realizar login:",
      error,
    );

    return Response.json(
      {
        error: "Não foi possível realizar o login.",
      },
      {
        status: 500,
      },
    );
  }
}