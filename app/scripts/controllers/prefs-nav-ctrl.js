

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */

angular.module('codexApp.prefs.nav', [])
  .controller('PrefsNavCtrl', ['$scope', '$rootScope', '$state', '$location', 'FileService', 'PrefsService', '$timeout', function ($scope,  $rootScope, $state, $location, FileService, PrefsService, $timeout) {

    $scope.links = [];
    console.log("-> Preferences/General");
    $scope.links[0] = "active";
    $scope.links[1] = "";

    $scope.goToGeneral = function () {
      console.log("-> Preferences/General")
      $scope.links[0] = "active";
      $scope.links[1] = "";
      $state.go("general");
    }

    $scope.goToDatabases = function () {
      console.log("-> Preferences/Databases")
      $scope.links[0] = "";
      $scope.links[1] = "active";
      $state.go("databases");
    }

  }]);
