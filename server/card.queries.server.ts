import { prisma } from "./db.server";

export async function createCard(
  name: string,
  url: string,
  imageUrl: string,
  dashboardId: string,
  groupId: string,
  position: number,
  size: string,
) {
  const card = await prisma.card.create({
    data: {
      name,
      url,
      imageUrl,
      dashboardId,
      groupId,
      position,
      size,
    },
  });
  return card;
}

export async function getCards(dashboardId: string) {
  const cards = await prisma.card.findMany({
    where: { dashboardId },
    select: {
      id: true,
      name: true,
      url: true,
      imageUrl: true,
      dashboardId: true,
      size: true,
      position: true,
      createdAt: true,
      updatedAt: true,
      group: {
        select: {
          id: true,
          name: true,
          userId: true,
        },
      },
    },
  });

  return cards;
}

export async function getCardInfo(dashboardId: string) {
    const cards = await prisma.card.findMany({
        where: { dashboardId },
        select: {
          position: true,
        }
    });
    
    return cards;
}

export async function getCard(cardId: string | undefined) {
  if (!cardId) return null;
  
  const card = await prisma.card.findUnique({
    where: { id: cardId },
  });
  
  return card;
}

export async function updateCard(
  cardId: string,
  name: string,
  url: string,
  imageUrl: string,
  groupId: string,
  position: number,
  size: string,
) {
  return await prisma.$transaction(async (tx) => {
    const currentCard = await tx.card.findUnique({
      where: { id: cardId },
      select: { position: true, dashboardId: true },
    });

    if (!currentCard) return { error: "Card not found"};

    const oldPosition = currentCard.position;
    const dashboardId = currentCard.dashboardId;

    if (oldPosition !== position) {
      const cardCount = await tx.card.count({ where: { dashboardId } });
      const clampedPosition = Math.min(Math.max(position, 1), cardCount);

      if (oldPosition < clampedPosition) {
        await tx.card.updateMany({
          where: {
            dashboardId,
            position: { gt: oldPosition, lte: clampedPosition },
          },
          data: { position: { decrement: 1 } },
        });
      } else if (oldPosition > clampedPosition) {
        await tx.card.updateMany({
          where: {
            dashboardId,
            position: { gte: clampedPosition, lt: oldPosition },
          },
          data: { position: { increment: 1 } },
        });
      }

      return await tx.card.update({
        where: { id: cardId },
        data: {
          name,
          url,
          imageUrl,
          groupId,
          position: clampedPosition,
          size,
        },
      });
    }

    return await tx.card.update({
      where: { id: cardId },
      data: {
        name,
        url,
        imageUrl,
        groupId,
        size,
      },
    });
  });
}

export async function deleteCard(cardId: string) {
  const card = await prisma.card.delete({
    where: { id: cardId },
  });
  
  return card;
}
