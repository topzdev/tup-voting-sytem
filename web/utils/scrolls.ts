export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);

  if (element)
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      // inline: "nearest",
    });
};
