import axiosClient from "./axiosClient";

export const getLatestChecks = async () => {
  const { data } = await axiosClient.get("/checks");
  return data;
};
