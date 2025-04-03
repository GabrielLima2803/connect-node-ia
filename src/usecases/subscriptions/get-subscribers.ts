import prisma from "../../config/prisma/client";

export const getSubscribers = async () => {
  const subscribers = await prisma.subscription.findMany();
  return { subscribers };
};
