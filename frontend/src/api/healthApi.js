import axiosClient from "./axiosClient";

export const getHealth = async () => {
  const { data } = await axiosClient.get("/health");
  return data;
};
