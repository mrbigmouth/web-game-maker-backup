<template>
  <collapse-card @open="loadBriefGameList">
    <span slot="title">{{ $t('gameInDeveloping') }}</span>
    <div slot="body">
      <table class="table table-bordered">
        <caption class="text-right">
          <button
            class="btn btn-primary btn-sm"
            type="button"
            @click="showCreateGameDialog"
          >
            {{ $t('createNewGame') }}
          </button>
        </caption>
        <thead>
          <tr>
            <th>{{ $t('gameName') }}</th>
            <th style="width: 200px;">
              {{ $t('lastOpenTime') }}
              <icon icon="sort-amount-down" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="game in gameList(displayRows)"
            :key="game.id"
          >
            <td>
              <a
                :href="`./project.html?gid=${game.id}`"
                target="_blank"
                @click="updateGameOpenTime(game.id)"
              >
                {{ game.name }}
              </a>
            </td>
            <th>{{ game.lastOpenTime | msToDateTime }}</th>
          </tr>
          <tr v-if="gameList(displayRows).length === 0">
            <td colspan="2">
              {{ $t('noAnyData') }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="canSeeMore(displayRows)">
          <tr>
            <td
              class="text-right"
              colspan="2"
            >
              <a
                href="#"
                @click.prevent="seeMore"
              >
                {{ $t('seeMore') }}
              </a>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </collapse-card>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import CollapseCard from 'utils/collapseCard/CollapseCard';
  import { i18nLocalization } from 'utils/i18n/i18n';

  window.mapMutations = mapMutations;
  export default {
    name: 'PanelGameListInDeveloping',
    components: {
      'collapse-card': CollapseCard,
    },
    data() {
      return {
        displayRows: 3,
      };
    },
    computed: {
      ...mapGetters('maker', {
        gameList: 'getBriefGameList',
        canSeeMore: 'isGameNumberLesserThan',
      }),
    },
    methods: {
      ...mapMutations('page/confirmDialog', [
        'showConfirmDialog',
      ]),
      ...mapActions('maker', [
        'loadBriefGameList',
        'updateGameOpenTime',
      ]),
      ...mapMutations('page', [
        'showCreateGameDialog',
      ]),
    },
    ...i18nLocalization('home'),
  };
</script>