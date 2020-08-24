const getJobs = require("../utils/getJobs");

module.exports = async (req, res, next) => {
  const { query } = req.params;
  const city = req.query.city || "";
  const type = req.query.type || 0;

  if (query === "") {
    next({
      message: "Please provide a search query",
      statusCode: 400,
    });
  }

  const data = await getJobs(query, city, type);

  if (data.length === 0) {
    return next({
      message: "No job were Found",
      statusCode: 404,
    });
  }

  res.status(200).json({
    success: true,
    query,
    count: data.length,
    data,
  });
};
