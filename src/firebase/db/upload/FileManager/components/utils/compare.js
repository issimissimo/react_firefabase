export function compareToObject(item1, item2) {
  if (item1.name !== item2.name) return false;
  if (item1.path !== item2.path) return false;
  return true;
}

export function compareToArray(item1, array) {
  if (array.length === 0) return false;
  let val = false;
  array.forEach((el) => {
    if (item1.name === el.name && item1.path === el.path) val = true;
  });
  return val;
}

export function compareSimpleObjects(obj1, obj2){
  if (obj2 === null) return false;
  if(JSON.stringify(obj1) === JSON.stringify(obj2)) return true;
  return false;
}
