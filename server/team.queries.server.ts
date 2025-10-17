import { prisma } from "./db.server";

function generateAccessCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createTeam({
  name,
  isAdmin,
  privateTeam,
  userId,
}: {
  name: string;
  isAdmin: boolean;
  privateTeam: boolean;
  userId: string;
}) {
  const accessCode = privateTeam ? generateAccessCode() : null;

  return prisma.teams.create({
    data: {
      name,
      isAdmin,
      privateTeam,
      accessCode,
      createdById: userId,
    },
  });
}

export async function getTeams(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const isAdmin = user?.isAdmin ?? false;

  const teamOwner = await prisma.teams.findMany({
    where: { createdById: userId },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      privateTeam: true,
    },
  });

  const publicTeams = await prisma.teams.findMany({
    where: { privateTeam: false },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      privateTeam: true,
    },
  });

  let privateTeams;

  if (isAdmin) {
    privateTeams = await prisma.teams.findMany({
      where: { privateTeam: true },
      select: {
        id: true,
        name: true,
        isAdmin: true,
        privateTeam: true,
      },
    });
  } else {
    privateTeams = await prisma.teamAccess.findMany({
      where: { userId },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            isAdmin: true,
            privateTeam: true,
          },
        },
      },
    });
  }

  return { publicTeams, privateTeams, teamOwner };
}

export async function getJoinableTeams(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const isAdmin = user?.isAdmin ?? false;

  const joinedTeams = await prisma.teamAccess.findMany({
    where: { userId },
    select: { teamId: true },
  });

  const joinedTeamIds = joinedTeams.map((t) => t.teamId);

  const joinableTeams = await prisma.teams.findMany({
    where: {
      ...(isAdmin ? {} : { isAdmin: false, privateTeam: true }),
      id: { notIn: joinedTeamIds.length > 0 ? joinedTeamIds : [""] },
      NOT: { createdById: userId },
    },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      privateTeam: true,
    },
  });

  return joinableTeams;
}

export async function getPrivateTeams(userId: string) {
  const teamOwner = await prisma.teams.findMany({
    where: { createdById: userId },
  });

  return { teamOwner };
}

export async function getTeamById(id: string) {
  return await prisma.teams.findUnique({
    where: { id },
  });
}

export async function updateTeam(
  id: string,
  name: string,
  isAdmin: boolean,
  privateTeam: boolean
) {
  const existing = await prisma.teams.findUnique({ where: { id } });
  let accessCode = existing?.accessCode ?? null;

  if (privateTeam && !existing?.accessCode) {
    accessCode = generateAccessCode();
  }

  if (!privateTeam) {
    accessCode = null;
  }

  return prisma.teams.update({
    where: { id },
    data: {
      name,
      isAdmin,
      privateTeam,
      accessCode,
    },
  });
}

export async function deleteTeam(id: string) {
  return prisma.teams.delete({
    where: { id },
  });
}

export async function leaveTeam(teamId: string, userId: string) {
  const update = await prisma.teams.updateMany({
    where: { id: teamId, createdById: userId },
    data: {
      privateTeam: false,
      accessCode: null,
    },
  });

  const leave = await prisma.teamAccess.deleteMany({
    where: {
      teamId: teamId,
      userId: userId,
    },
  });

  return { update, leave };
}
