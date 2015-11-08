angular.module('codexApp')
.service('PrefsService', [ '$rootScope', '$http',  function($rootScope, $http) {

  var views = ["All Notes", "All Files", "Notebooks", "Notebook"];
  var current_view = "All Notes"

  this.getCurrentView = function() {
    return current_view;
  }
  this.setCurrentView = function(view) {
    current_view = view;
  }

}])
