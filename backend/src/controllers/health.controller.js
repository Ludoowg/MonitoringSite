const health = (_req, res) => {
  res.json({
    status: "ok",
    service: "monitoringsite-backend",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  health,
};
