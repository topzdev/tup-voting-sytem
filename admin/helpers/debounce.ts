const debounce = (fn: Function, delay: number) => {
  let timeoutID: any = null;
  return function () {
    clearTimeout(timeoutID);
    let args = arguments;
    //@ts-ignore
    let that = this;
    timeoutID = setTimeout(function () {
      fn.apply(that, args);
    }, delay);
  };
};

export default debounce;
