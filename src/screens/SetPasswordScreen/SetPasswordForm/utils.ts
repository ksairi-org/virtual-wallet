const getFirstAndLastName = (fullName: string) => {
  const [firstName, lastName = ''] = fullName.split(' ');

  return { firstName, lastName };
};

export { getFirstAndLastName };
