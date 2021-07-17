const env = {
  serviceURL: null,
  comURL: null,
  hsmURL: null,
  websocketURL: null,
};

export const getEnv = () => {
  return env;
};

export const setEnv = ({
  serviceURL = null,
}) => {
  env.serviceURL = serviceURL || env.serviceURL;
};
