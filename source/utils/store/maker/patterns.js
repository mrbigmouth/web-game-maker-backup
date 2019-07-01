import { patterns } from 'check';

export const gameBriefPattern = {
  id: patterns.int,
  name: String,
  lastOpenTime: patterns.int,
};

export const gameDetailPattern = {
  id: patterns.int,
  name: String,
  lastOpenTime: patterns.int,
  blockList: [Object],
  processFolder: [Object],
  processList: [Object],
  variableFolder: [
    {
      id: String,
      folder: String,
      name: String,
    },
  ],
  variableList: [
    {
      id: String,
      folder: String,
      name: String,
      pattern: patterns.match((value) => {
        return  (
          value === String ||
          value === Number ||
          typeof value === 'string' ||
          (
            Array.isArray(value) &&
            value.length === 1 &&
            (
              value[0] === String ||
              value[0] === Number ||
              typeof value[0] === 'string'
            )
          )
        );
      }),
      value: patterns.oneOf(String, Number, [String], [Number]),
    },
  ],
  mediaFolder: [Object],
  mediaList: [Object],
  database: [Object],
};
