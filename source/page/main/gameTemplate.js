const sourceTemplateList = [
  {
    name: '空白模板',
    folderList: [],
    blockFolder: [],
    blockList: [],
    processFolder: [],
    processList: [],
    variableFolder: [],
    variableList: [],
    mediaFolder: [],
    mediaList: [],
    database: [],
  },
  {
    name: 'MUD',
    folderList: ['文字類型遊戲模板'],
    blockFolder: [],
    blockList: [],
    processFolder: [],
    processList: [],
    variableFolder: [],
    variableList: [],
    mediaFolder: [],
    mediaList: [],
    database: [],
  },
  {
    name: 'RAGS',
    folderList: ['文字類型遊戲模板'],
    blockFolder: [],
    blockList: [],
    processFolder: [],
    processList: [],
    variableFolder: [],
    variableList: [],
    mediaFolder: [],
    mediaList: [],
    database: [],
  },
];

const folderSet = new Set();
function getFolderId(folder) {
  return '' + Array.from(folderSet).indexOf(folder);
}

export const templateList = [];
let idCount = 0;
sourceTemplateList.forEach((template) => {
  if (template.folderList.length) {
    template.folderList.forEach((folder) => {
      folderSet.add(folder);
      templateList.push({
        id: '' + idCount,
        folder: getFolderId(folder),
        name: template.name,
      });
      idCount += 1;
    });
  }
  else {
    templateList.push({
      id: '' + idCount,
      folder: '',
      name: template.name,
    });
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
