// eslint-disable-line no-explicit-any
function getFuncResult<T>(instance: T, funcName: keyof T, ...args: any) {
  const method = instance[funcName];
  if (typeof method !== 'function')
    throw new Error(`${String(funcName)} is not a function`);

  return method.apply(instance, args);
}

export { getFuncResult };
