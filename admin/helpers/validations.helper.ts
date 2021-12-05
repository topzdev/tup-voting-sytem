export const isURL = (_url: string) => {
  let url;

  try {
    url = new URL(_url);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
