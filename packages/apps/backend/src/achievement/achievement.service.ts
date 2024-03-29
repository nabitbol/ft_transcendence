import { AchievementDto } from "@ft-transcendence/libs-shared-types";
import prisma from "@ft-transcendence/libs-backend-prisma-client";

const Achievement1: AchievementDto = {
  title: "Winner 1",
  content: "Win your first pong game!",
  image: "Achievement",
  condition: 1,
};

const Achievement2: AchievementDto = {
  title: "Winner 2",
  content: "Win three pong game!",
  image: "Achievement",
  condition: 3,
};

const Achievement3: AchievementDto = {
  title: "Winner 3",
  content: "Win ten pong game!",
  image: "Achievement",
  condition: 10,
};

const seedAchievement = async () => {
  const tmp: AchievementDto[] = [Achievement1, Achievement2, Achievement3];

  const check_exist = await prisma.achievement.findFirst();
  if(check_exist)
    return;
  await prisma.achievement.createMany({
    data: tmp,
  });
};

export { seedAchievement };
