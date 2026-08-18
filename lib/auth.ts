import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "maison_admin_session";
const SESSION_DURATION = 60 * 60 * 8;

interface SessionPayload {
  email: string;
  expiresAt: number;
}

function safeCompare(
  receivedValue: string,
  expectedValue: string,
) {
  const receivedBuffer = Buffer.from(receivedValue);
  const expectedBuffer = Buffer.from(expectedValue);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer,
  );
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "A variável SESSION_SECRET não foi configurada.",
    );
  }

  return secret;
}

function createSignature(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    expiresAt:
      Math.floor(Date.now() / 1000) + SESSION_DURATION,
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload),
  ).toString("base64url");

  const signature = createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string) {
  try {
    const [encodedPayload, receivedSignature] =
      token.split(".");

    if (!encodedPayload || !receivedSignature) {
      return null;
    }

    const expectedSignature =
      createSignature(encodedPayload);

    if (
      !safeCompare(
        receivedSignature,
        expectedSignature,
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(
        encodedPayload,
        "base64url",
      ).toString("utf8"),
    ) as SessionPayload;

    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.expiresAt <= currentTime) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(
  email: string,
  password: string,
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "As credenciais do administrador não foram configuradas.",
    );
  }

  return (
    safeCompare(email, adminEmail) &&
    safeCompare(password, adminPassword)
  );
}

export async function createAdminSession(
  email: string,
) {
  const cookieStore = await cookies();
  const token = createSessionToken(email);

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}