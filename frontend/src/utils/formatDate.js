export const formatDate = (value) => {
  if (!value) return "Never";
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};
