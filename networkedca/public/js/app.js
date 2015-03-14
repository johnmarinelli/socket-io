// container for predefined patterns.
(function() {
  var lifePatterns = angular.module('lifePatterns', []);

  lifePatterns.controller('lifePatterns', function($scope) {
    $scope.lifePatterns = {
      'r-pentomino': [ [0, 1, 1],
                       [1, 1, 0],
                       [0, 1, 0] ],

      'square': [ [1, 1, 1],
                  [1, 1, 1],
                  [1, 1, 1] ],
      
      'something': [ [1,0],
                     [0, 1],
                     [1, 0] ]
    };
  });
}());

// HTML template for the drag and drop footer.
(function() {
  var dragAndDropDir = angular.module('dragAndDropDirective', []);

  dragAndDropDir.directive('dragAndDrop', function() {
    return {
      restrict: 'E',
      templateUrl: 'drag_and_drop.html'
    };
  });
}());

(function() {
  var app = angular.module('cellularAutomata', ['dragAndDropDirective', 'lifePatterns']);
}());

