const buildPath = (basePath, path) => {
  const root = basePath !== '/' ? basePath : '';
  return root + path;
};

const buildMatchPath = (match, path) => {
  const root = match.path !== '/' ? match.path : '';
  return root + path;
};

export { buildPath, buildMatchPath };
