import { prisma } from "./db.server";

export async function readNotification(id: string, userId: string) {
  const notification = await prisma.notifications.update({
    where: { id: id },
    data: {
      readById: {
        push: userId,
      }
    },
  });

  return notification;
}

export async function sendNotification(title: string, message: string) {
  const notification = await prisma.notifications.create({
    data: {
      title,
      message,
    },
  });
  return notification;
}

export async function getNotification() {
  const notification = await prisma.notifications.findMany({
    select: {
      id: true,
      title: true,
      message: true,
      createdAt: true,
      readById: true,
    },
  });
  return notification;
}

export async function deleteNotification(id: string) {
  return await prisma.notifications.delete({
    where: {
      id: id,
    },
  });
}
