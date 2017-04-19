(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ProductListController', ProductListController);

  /** @ngInject */
  function ProductListController($state, SystemApi, $log, $rootScope, localStorageService) {

    var vm = this,
      pageIndex, itemsPerPage;

    vm.goBack = goBack;

    vm.goBackExchange = goBackExchange;

    vm.goMyBackExchange = goMyBackExchange;

    vm.fabulous = fabulous;

    vm.typeId = localStorageService.get("typeId");

    vm.doRefresh = init;

    vm.loadMore = load;

    function goBack() {
      $state.go("mall:nbRules");
    }

    function goBackExchange(cb_id) {
      localStorageService.set('cd_Id', cb_id);
      $state.go("mall:exchange");
    }

    function goMyBackExchange() {
      $state.go("mall:myproduct:list");
    }

    function fabulous(index, $event) {
      var id = document.getElementsByClassName("fabulous")[index].getAttribute("c_id");
      var type = document.getElementsByClassName("fabulous")[index].getAttribute("t_id");
      if (+type == 0) {
        SystemApi.getSaveUserPraise({ "cb_id": id }).success(function(res) {
          if (+res.flag == 1) {　
            vm.items[index].praise_type = 1
          }
        })
      } else if (+type == 1) {
        SystemApi.getCancelUserPraise({ "cb_id": id }).success(function(res) {
          if (+res.flag == 1) {
            vm.items[index].praise_type = 0;
          }
        })
      }
      $event.stopPropagation();
    }

    function init() {
      pageIndex = 0;
      itemsPerPage = 10;
      vm.hasMoreData = false;

      vm.items = [];
      load();
    }

    function load() {
      if (vm.typeId == 0) {
        SystemApi.getBangList({
          pageIndex: pageIndex,
          itemsPerPage: itemsPerPage,
          cbType: vm.typeId
        }).success(function(res) {
          if (res.flag === 1) {
            res.data.result.forEach(function(_item) {
              vm.items.push(_item);
            });
            vm.hasMoreData = res.data.result.length === itemsPerPage;
          }
        }).finally(function() {
          $rootScope.$broadcast('scroll.refreshComplete');
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        });
        pageIndex++;
      } else {
        SystemApi.getBangDrawList({
          pageIndex: pageIndex,
          itemsPerPage: itemsPerPage,
          cbType: vm.typeId
        }).success(function(res) {
          if (res.flag === 1) {
            res.data.result.forEach(function(_item) {
              vm.items.push(_item);
            });
            vm.hasMoreData = res.data.result.length === itemsPerPage;
          }
        }).finally(function() {
          $rootScope.$broadcast('scroll.refreshComplete');
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        });
        pageIndex++;
      }

    }
    init();
  }
})();
