<template>
  <collapse-card @open="loadBriefGameList">
    <span slot="title">{{$t('gameListInMaking')}}</span>
    <div slot="body">
      <table class="table table-bordered">
        <caption class="text-right">
          <button
            @click="showCreateGameDialog"
            class="btn btn-primary btn-sm"
            type="button"
          >
            {{$t('createNewGame')}}
          </button>
        </caption>
        <thead>
          <tr>
            <th>{{$t('gameName')}}</th>
            <th style="width: 200px;">
              {{$t('lastOpenTime')}}
              <icon icon="sort-amount-down" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in gameList(displayRows)">
            <td>
              <a
                @click="updateGameOpenTime(game.id)"
                :href="`./makerMain.html?gid=${game.id}`"
                target="_blank"
              >
                {{game.name}}
              </a>
            </td>
            <th>{{game.lastOpenTime | msToDateTime}}</th>
          </tr>
          <tr v-if="gameList(displayRows).length === 0">
            <td colspan="2">{{$t('noAnyData')}}</td>
          </tr>
        </tbody>
        <tfoot v-if="canSeeMore(displayRows)">
          <tr>
            <td class="text-right" colspan="2">
              <a href="#" @click.prevent="seeMore">
                {{$t('seeMore')}}
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

  window.mapMutations = mapMutations;
  export default {
    name: 'PanelGameListInDeveloping',
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
    components: {
      'collapse-card': CollapseCard,
    },
  };
</script>