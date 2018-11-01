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
  blockFolder: [Object],
  blockList: [Object],
  processFolder: [Object],
  processList: [Object],
  variableFolder: [Object],
  variableList: [Object],
  mediaFolder: [Object],
  mediaList: [Object],
  database: [Object],
};
