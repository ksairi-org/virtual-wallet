type FieldFilter = string | number | null | undefined;

const getQueryFilters = (fieldFilters: Record<string, unknown>) => {
  const validEntries = Object.entries(fieldFilters).filter(
    (entry): entry is [string, NonNullable<FieldFilter>] => {
      const [, value] = entry;
      return value !== null && value !== undefined;
    },
  );
  return validEntries.length > 0
    ? Object.fromEntries(
        validEntries.map(([key, value]) => [key, `eq.${value}`]),
      )
    : undefined;
};
export { getQueryFilters };
