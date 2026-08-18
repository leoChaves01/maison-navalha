import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável DATABASE_URL não foi configurada.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const barbers = [
  {
    name: "Rafael Monteiro",
    slug: "rafael-monteiro",
    specialty: "Barbeiro master · 12 anos",
  },
  {
    name: "Lucas Carvalho",
    slug: "lucas-carvalho",
    specialty: "Especialista em visagismo",
  },
  {
    name: "Gabriel Alves",
    slug: "gabriel-alves",
    specialty: "Barba e grooming",
  },
];

const services = [
  {
    name: "Corte Signature",
    slug: "corte-signature",
    description: "Consultoria, corte, lavagem e finalização.",
    duration: 50,
    price: 8500,
  },
  {
    name: "Barba Imperial",
    slug: "barba-imperial",
    description: "Toalha quente, ritual de óleos e acabamento.",
    duration: 40,
    price: 6500,
  },
  {
    name: "Corte + Barba",
    slug: "corte-barba",
    description: "Corte completo acompanhado do ritual de barba.",
    duration: 80,
    price: 13500,
  },
  {
    name: "Experiência Maison",
    slug: "experiencia-maison",
    description:
      "Corte, barba, sobrancelha e cuidado facial.",
    duration: 105,
    price: 16500,
  },
];

async function main() {
  for (const barber of barbers) {
    await prisma.barber.upsert({
      where: {
        slug: barber.slug,
      },
      update: barber,
      create: barber,
    });
  }

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        slug: service.slug,
      },
      update: service,
      create: service,
    });
  }

  console.log("Barbeiros e serviços cadastrados com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao cadastrar os dados:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });