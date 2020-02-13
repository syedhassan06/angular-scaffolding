export const getProgressList = () => {
  return [
    { label: 'Registered', value: 'registered' },
    { label: 'In-Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Expired', value: 'expired' }
  ];
};

export const getRoleList = () => {
  return [
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Learner', value: 'Learner' }
  ];
};

export const getStatusList = () => {
  return [
    { label: 'Active', value: 'active' },
    { label: 'In-Active', value: 'in-active' }
  ];
};

export const deepCopy = (oldObj: any) => {
  let newObj = oldObj;
  if (oldObj && typeof oldObj === 'object') {
    newObj =
      Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
    for (const i of Object.keys(oldObj)) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }
  return newObj;
};

export const capitalize = (value: any) => {
  if (!value || typeof value !== 'string') return value;

  return value.replace(/\w\S*/g, function(txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const interpolate = (str, params) => {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${str}\`;`)(...vals);
};
