export type UserType = {
  name: string;
  email: string;
  password: string;
  image: string;
  doubleAuth?: boolean | undefined;
  wins?: number | undefined;
  losses?: number | undefined;
  draw?: number | undefined;
  level?: number | undefined;
  userRankId?: string | undefined;
};
