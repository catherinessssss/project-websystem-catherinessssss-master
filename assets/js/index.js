angular.module('myApp', ['ngMaterial'])

.controller('AppCtrl', function($scope, $mdDialog) {
  $scope.status = false;
  

  $scope.showConfirm = function(ev, id) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete?')
          .textContent('All of the property\'s information will gone!')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
    
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/property/delete/'+ id, true);
      xhr.onload = function(e){
        $scope.status = 'Delete Sucessfully!';
        location.reload(true);
      };
      xhr.send();      
    }, function() {
       $scope.status = false;
    });
  };

});


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/