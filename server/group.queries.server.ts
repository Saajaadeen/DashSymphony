import { prisma } from "./db.server";

export async function createGroup(name: string, userId: string) {
  const group = await prisma.groups.create({
    data: { 
        name,
        userId,
     },
  });

  return group;
}

export async function readPublicGroup() {
  const group = await prisma.groups.findMany({
    where: { userId: null},
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return group;
}

export async function readPrivateGroup(userId: string) {
  const group = await prisma.groups.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return group;
}

export async function getGroupById(groupId: string) {
  const group = await prisma.groups.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
    },
  });

  return group;
}

export async function updateGroup(name: string, id: string) {
  const group = await prisma.groups.update({
    where: { id },
    data: {
      name,
    },
  });

  return group;
}

export async function deleteGroup(id: string) {
  const group = await prisma.groups.delete({
    where: { id },
  });

  return group;
}