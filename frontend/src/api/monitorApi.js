import axiosClient from "./axiosClient";

export const getMonitors = async () => {
  const { data } = await axiosClient.get("/monitors");
  return data;
};

export const getMonitorById = async (id) => {
  const { data } = await axiosClient.get(`/monitors/${id}`);
  return data;
};

export const createMonitor = async (payload) => {
  const { data } = await axiosClient.post("/monitors", payload);
  return data;
};

export const updateMonitor = async (id, payload) => {
  const { data } = await axiosClient.patch(`/monitors/${id}`, payload);
  return data;
};

export const deleteMonitor = async (id) => {
  const { data } = await axiosClient.delete(`/monitors/${id}`);
  return data;
};

export const runMonitorCheck = async (id) => {
  const { data } = await axiosClient.post(`/monitors/${id}/check`);
  return data;
};

export const getMonitorChecks = async (id) => {
  const { data } = await axiosClient.get(`/monitors/${id}/checks`);
  return data;
};
