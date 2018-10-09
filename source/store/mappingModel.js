export default function mappingModel(prefixPath = '', fields = []) {
  const result = {};
  if (Array.isArray(fields)) {
    fields.forEach((fieldName) => {
      const path = `${prefixPath}/${fieldName}`;
      result[fieldName] = {
        get() {
          return this.$store.getters.read(path);
        },
        set(value) {
          this.$store.dispatch('update', {
            [path]: value,
          });
        },
      };
    });
  }
  else {
    Object.keys(fields).forEach((aliasFieldName) => {
      const path = `${prefixPath}/${fields[aliasFieldName]}`;
      result[aliasFieldName] = {
        get() {
          return this.$store.getters.read(path);
        },
        set(value) {
          this.$store.dispatch('update', {
            [path]: value,
          });
        },
      };
    });
  }

  return result;
}
