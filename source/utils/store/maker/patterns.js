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
};
