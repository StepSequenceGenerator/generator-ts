export function convertFromObjectToMap(data: object[]) {
  return data.map((item) => {
    return new Map(Object.entries(item));
  });
}
