const parseDate = (date: Date | string) => {
  return new Date(date).toISOString();
};

export default parseDate;
