export const MIN_SEARCH_QUERY_LENGTH = 2;
export const MAX_SEARCH_QUERY_LENGTH = 60;

const ALLOWED_SEARCH_PATTERN = /^[a-zA-Z0-9\s'&.-]+$/;

export const normalizeSearchQuery = (input) =>
  String(input ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SEARCH_QUERY_LENGTH);

export const getSearchValidationError = (rawInput) => {
  const normalized = normalizeSearchQuery(rawInput);

  if (!normalized) return 'Please enter a search term.';
  if (normalized.length < MIN_SEARCH_QUERY_LENGTH) {
    return `Use at least ${MIN_SEARCH_QUERY_LENGTH} characters.`;
  }
  if (!ALLOWED_SEARCH_PATTERN.test(normalized)) {
    return "Use letters, numbers, spaces, and only these symbols: ' & . -";
  }

  return '';
};
