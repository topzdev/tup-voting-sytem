const transformParamsToUrl = (_params: Record<any, any>) => {
  const paramsUrl = new URLSearchParams();

  for (const key in _params) {
    if (_params[key]) {
      paramsUrl.set(key, _params[key]);
    }
  }

  return "?" + paramsUrl.toString();
};

export default transformParamsToUrl;
