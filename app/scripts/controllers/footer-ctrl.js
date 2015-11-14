

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.footer', [])
  .controller('FooterCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    console.log('-> Footer loaded')

    $rootScope.$on('footer:info', function(info, data) {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.footer_info = data;
        });
      } else {
        $scope.footer_info = data;
      }

    });

  }]);
