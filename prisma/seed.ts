import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UserType = {
  name: string;
  email: string;
  password: string;
  image: string;
  doubleAuth?: boolean | undefined;
  doubleAuthSecret?: string | undefined;
  wins?: number | undefined;
  losses?: number | undefined;
  draw?: number | undefined;
  level?: number | undefined;
  userRankId?: string | undefined;
};

const User: UserType = {
  name: "Demo",
  email: "Demo@mail.com",
  password: "Demo",
  image: "DemoString",
};

const main = async () => {
  await prisma.user.create({ data: User });
};

main()
  .catch((err) => {
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
