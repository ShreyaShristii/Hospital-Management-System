/**
 * Pagination Helper Utility
 * Standardizes pagination across all controllers
 */

const getPaginationParams = (query) => {
  // Bypass mode for dropdowns/stats that need the full dataset (?all=true)
  if (query.all === 'true') {
    return { page: 1, limit: 0, skip: 0 };
  }

  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationResponse = (data, total, page, limit) => {
  // limit === 0 means "all records" (mongoose .limit(0) applies no limit)
  const pageSize = limit === 0 ? total : limit;
  const pages = limit === 0 ? 1 : Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    pages,
    pageSize,
  };
};

module.exports = {
  getPaginationParams,
  getPaginationResponse,
};
