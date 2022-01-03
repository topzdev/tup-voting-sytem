import shortid from "shortid";

const generateId = () => {
  return shortid.generate().toUpperCase();
};

export default generateId;
