import * as RealmWeb from "realm-web";

const isValidArrayIndex = <T>(arr: Array<T>, idx: number) => {
  return !(idx < 0 || idx >= arr.length);
};

export const addValueAtIndex = <T>(arr: Array<T>, idx: number, value: T) => {
  if (!isValidArrayIndex(arr, idx) && idx !== arr.length) {
    throw new Error(`Cannot add value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), value, ...arr.slice(idx)];
};

export const replaceValueAtIndex = <T>(
  arr: Array<T>,
  idx: number,
  newValue: T
) => {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot replace value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1)];
};

export const updateValueAtIndex = <T>(
  arr: Array<T>,
  idx: number,
  updater: (value: T) => T
) => {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot update value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), updater(arr[idx]), ...arr.slice(idx + 1)];
};

export const removeValueAtIndex = <T>(arr: Array<T>, idx: number) => {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot remove value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
};

export const createObjectId = () => {
  return new RealmWeb.BSON.ObjectId();
};

export const getDocumentId = <T extends Realm.Services.MongoDB.Document>(
  todo: T
) => {
  if (todo._id instanceof RealmWeb.BSON.ObjectId) {
    return todo._id.toHexString();
  }
  return todo._id;
};

export const isSameDocument = <T extends Realm.Services.MongoDB.Document>(
  doc1: T,
  doc2: T
) => getDocumentId(doc1) === getDocumentId(doc2);

export const getDocumentIndex = <T extends Realm.Services.MongoDB.Document>(
  arr: Array<T>,
  value: T
) => {
  const idx = arr.findIndex((t) => isSameDocument(t, value));
  return idx >= 0 ? idx : null;
};
