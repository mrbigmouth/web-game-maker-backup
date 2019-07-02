import Vue from 'vue';
import moment from 'moment';

Vue.filter('msToDate', function(value) {
  return moment('' + value, 'x').format('YYYY/MM/DD');
});

Vue.filter('msToDateTime', function(value) {
  return moment('' + value, 'x').format('YYYY/MM/DD hh:mm:ss');
});
