<template>
  <form class="container-fluid">
    <collapse-card>
      <span slot="title">{{$t('basicSettings')}}</span>
      <div slot="body" class="form-group">
        <label for="language">
          {{$t('language')}}
        </label>
        <select
          v-model="locale"
          name="language"
          class="form-control"
        >
          <option value="en">English</option>
          <option value="zh-tw">繁體中文</option>
          <option value="zh-cn">简体中文</option>
        </select>
      </div>
    </collapse-card>
  </form>
</template>

<script>
  import 'utils/font-awesome';
  import 'utils/bootstrap-watch-slate.min.css';
  // import { mapState, mapGetters, mapMutations } from 'vuex';
  import CollapseCard from 'utils/vue/CollapseCard';
  import setDocumentTitle from 'utils/mixins/setDocumentTitle';
  import mappingModel from 'store/mappingModel';

  export default {
    name: 'Home',
    mixins: [setDocumentTitle],
    computed: {
      documentTitle() {
        return this.$t('documentTitle', {
          pageName: this.$t('pageNameMain'),
        });
      },
      ...mappingModel('/i18n', [
        'locale',
      ]),
    },
    methods: {
    },
    components: {
      'collapse-card': CollapseCard,
    },
  };
</script>