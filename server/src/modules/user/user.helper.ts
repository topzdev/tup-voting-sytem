const generatePassword = (username, lastname) => {
  return `${username}-${lastname}`.toLowerCase();
};

const userHelper = {
  generatePassword,
};

export default userHelper;
