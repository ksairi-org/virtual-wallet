const IGNORED_ERRORS = [
  /Request failed with status code 401/i, // No need to track unauthorized requests errors
];

export { IGNORED_ERRORS };
