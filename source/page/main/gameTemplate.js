import { gameDetailPattern } from 'utils/store/maker/patterns';

const sourceTemplateList = [
  {
    name: '空白範本',
    folderList: [],
  },
  {
    name: 'MUD遊戲範本',
    folderList: [
      '文字類型遊戲',
      '線上遊戲',
      '多人線上遊戲',
    ],
    variableFolder: [
      {
        id: '1',
        folder: '',
        name: '暫存變數',
      }
    ],
    variableList: [
      {
        id: '1',
        folder: '1',
        name: '迴圈計數器',
      }
    ],
  },
  {
    name: 'RAGS遊戲範本',
    folderList: ['文字類型遊戲'],
  },
];

const folderSet = new Set();
function getFolderId(folder) {
  return '' + Array.from(folderSet).indexOf(folder);
}

export const templateList = [];
let idCount = 0;
sourceTemplateList.forEach((templateSource) => {
  if (templateSource.folderList.length) {
    templateSource.folderList.forEach((folder) => {
      folderSet.add(folder);
      const templateData = {
        id: '' + idCount,
        folder: getFolderId(folder),
      };
      Object.keys(gameDetailPattern).forEach((patternKey) => {
        if (templateData[patternKey]) {
          return;
        }
        if (templateSource[patternKey]) {
          templateData[patternKey] = templateSource[patternKey];
        }
        else {
          const pattern = gameDetailPattern[patternKey];
          if (Array.isArray(pattern)) {
            templateData[patternKey] = [];
          }
          else if (pattern === String) {
            templateData[patternKey] = '';
          }
        }
      });
      templateList.push(templateData);
      idCount += 1;
    });
  }
  else {
    const templateData = {
      id: '' + idCount,
      folder: '',
    };
    Object.keys(gameDetailPattern).forEach((patternKey) => {
      if (templateData[patternKey]) {
        return;
      }
      if (templateSource[patternKey]) {
        templateData[patternKey] = templateSource[patternKey];
      }
      else {
        const pattern = gameDetailPattern[patternKey];
        if (Array.isArray(pattern)) {
          templateData[patternKey] = [];
        }
        else if (pattern === String) {
          templateData[patternKey] = '';
        }
      }
    });
    templateList.push(templateData);
    idCount += 1;
  }
});

export const templateFolderList = Array.from(folderSet).map((name, index) => {
  return {
    id: '' + index,
    folder: '',
    name,
  };
});
