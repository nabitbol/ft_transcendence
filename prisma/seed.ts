import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {

};

main()
  .catch((err) => {
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
