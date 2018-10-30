import { check, patterns } from 'check';

const basicTreeNodePattern = patterns.match((value) => {
  check(value, patterns.objectIncluding({
    id: String,
    folder: String,
  }));

  return true;
});

export function inputDataListValidator(value) {
  check(value, [basicTreeNodePattern]);

  return true;
}

export function folderDataValidator(value) {
  check(value, basicTreeNodePattern);
  check(value, patterns.objectIncluding({
    initialOpen: Boolean,
    children: [basicTreeNodePattern],
    source: Object,
    deepLevel: patterns.int,
  }));

  return true;
}

export function fileDataValidator(value) {
  check(value, basicTreeNodePattern);
  check(value, patterns.objectIncluding({
    source: Object,
    deepLevel: patterns.int,
  }));

  return true;
}

export function buttonListValidator(value) {
  check(value, [{
    id: String,
    icon: String,
    text: String,
    style: patterns.maybe(String),
    check: patterns.maybe(Function),
  }]);

  return true;
}

export function draggingDataValidator(value) {
  check(value, patterns.maybe({
    type: patterns.oneOf('folder', 'file'),
    data: basicTreeNodePattern,
  }));

  return true;
}

export function selectableValidator(value) {
  check(value, patterns.oneOf('single', 'multi', false, Function));

  return true;
}
