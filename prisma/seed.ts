import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UserType = {
  first_log?: boolean;
  name: string;
  name_42?: string | undefined;
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

type AchievementType = {
  id: string;
  title: string;
  content: string;
  image: string;
  condition: number;
};


const Achievement1: AchievementType = {
  id: "Achievement1",
  title: "Winner 1",
  content: "Win your first pong game!",
  image: "Achievement",
  condition: 1,
}

const Achievement2: AchievementType = {
  id: "Achievement2",
  title: "Winner 2",
  content: "Win three pong game!",
  image: "Achievement",
  condition: 3,
}

const Achievement3: AchievementType = {
  id: "Achievement3",
  title: "Winner 3",
  content: "Win ten pong game!",
  image: "Achievement",
  condition: 10,
}

const main = async () => {
  await prisma.achievement.create({data: Achievement1});
  await prisma.achievement.create({data: Achievement2});
  await prisma.achievement.create({data: Achievement3});
};

main()
  .catch((err) => {
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
