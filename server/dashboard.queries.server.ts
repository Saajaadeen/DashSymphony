import { prisma } from "./db.server";
import bcrypt from "bcryptjs";

export async function getUserDetails(userId: string) {
  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
    },
  });
  return userDetails;
}

export async function updateLoginInfo(loginName: string, loginImgUrl: string) {
  const loginInfo = await prisma.appSettings.upsert({
    where: { id: "DEFAULT" },
    update: {
      loginName,
      loginImgUrl,
    },
    create: {
      id: "DEFAULT",
      loginName,
      loginImgUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return loginInfo;
}

export async function getLoginInfo() {
  const loginInfo = await prisma.appSettings.upsert({
    where: { id: "DEFAULT" },
    update: {},
    create: {
      id: "DEFAULT",
      loginName: "Welcome Back",
      loginImgUrl: "",
      oAuthEnabled: false,
      landingEnabled: false,
      landingDashboardId: null,
    },
    include: {
      landingDashboard: true,
    },
  });
  return loginInfo;
}

export async function sendNotification(
  title: string, 
  message: string,
) {
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

export async function updateUserInfo(
  userId: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
) {
  const data: any = {
    firstName,
    lastName,
    email,
    updatedAt: new Date(),
  };

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    data.password = hashed;
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function createDashboard(
  userId: string,
  visibility: string[],
  permissions: string[],
  name: string,
  description: string,
  connectUser: boolean,
  createdById: string,
  teamId: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const restrictedVisibilities = ['GLOBAL', 'LANDING'];
  const isRestricted = visibility.some(v => restrictedVisibilities.includes(v));
  
  if (isRestricted && (!user || !Boolean(user.isAdmin))) {
    throw new Error('Only admin users can create GLOBAL or LANDING dashboards.');
  }

  const data: any = {
    name,
    description,
    visibility,
    permissions,
    createdById,
    teamId,
  };

  if (connectUser) {
    data.userId = userId;
  }

  const dashboard = await prisma.dashboard.create({ data });
  return dashboard;
}

export async function getPublicDashboards(){
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId: null,
      visibility: {
        has: 'PUBLIC',
      },
    }
  });

  return dashboard;
}

export async function getPrivateDashboards( userId: string ){
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId: userId,
      visibility: {
        has: 'PRIVATE',
      },
    }
  });

  return dashboard;
}

export async function getGlobalDashboards(){
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId: null,
      visibility: {
        has: 'GLOBAL',
      },
    }
  });

  return dashboard;
}

export async function getLandingDashboards(){
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId: null,
      visibility: {
        has: 'LANDING',
      },
    }
  });

  return dashboard;
}

export async function getDashboard(dashboardId: string){
  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId},
  });

  return dashboard;
}

export async function updateDashboard(
  dashboardId: string,
  visibility: string[],
  permissions: string[],
  name: string, 
  description: string,
  userId?: string | null,
) {
  const data: any = {
    visibility,
    permissions,
    name,
    description,
  };

  if (userId) {
    data.user = { connect: { id: userId } };
  } else if (visibility.includes("PRIVATE") === false) {
    data.user = { disconnect: true };
  }

  const dashboard = await prisma.dashboard.update({
    where: { id: dashboardId },
    data,
  });

  return dashboard;
}

export async function deleteDashboard(dashboardId: string) {
  const dashboard = await prisma.dashboard.delete({
    where: { id: dashboardId },
  });
  return dashboard;
}

export async function updateLandingSettings({
  landingEnabled,
  selectedLandingId,
}: {
  landingEnabled: boolean;
  selectedLandingId: string | null;
}) {
  return prisma.appSettings.update({
    where: { id: "DEFAULT" },
    data: {
      landingEnabled,
      landingDashboardId: selectedLandingId
    }
  })
}

export async function createTeam({
  name, 
  isAdmin
}: {
  name: string;
  isAdmin: boolean;
}) {
  return prisma.teams.create({
    data: {
      name,
      isAdmin,
    },
  });
}

export async function getTeam() {
  return prisma.teams.findMany({
    select: {
      id: true,
      name: true,
      isAdmin: true,
    }
  })
}

export async function getTeamById(id: string) {
  return await prisma.teams.findUnique({
    where: { id },
  });
}

export async function updateTeam(id: string, name: string, isAdmin: boolean) {
  return prisma.teams.update({
    where: { id },
    data: { name, isAdmin },
  });
}

export async function deleteTeam(id: string) {
  return prisma.teams.delete({
    where: { id },
  });
}