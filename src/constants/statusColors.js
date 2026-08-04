export const STATUS_COLORS = {
  ONLINE: "#00A36C",
  OFFLINE: "#F44336",
  ONLY_VIP: "#D573F3",
};

export const ADMIN_STATUS_COLORS = {
  ONLINE: "#052E16",
  OFFLINE: "#450a0a",
  ONLY_VIP: "#D573F3",
};

export const getStatusColor = (status, isAdmin = false) => {
  if (status === "Online") {
    return isAdmin ? ADMIN_STATUS_COLORS.ONLINE : STATUS_COLORS.ONLINE;
  }
  if (status === "Only VIP") {
    return STATUS_COLORS.ONLY_VIP;
  }
  return isAdmin ? ADMIN_STATUS_COLORS.OFFLINE : STATUS_COLORS.OFFLINE;
};
