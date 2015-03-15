// container for predefined patterns.
(function(patterns) {
  var lifePatterns = angular.module('lifePatterns', []);

  lifePatterns.controller('lifePatterns', function($scope) {
    $scope.lifePatterns = patterns;
  });
}(lifePatterns));

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

(function(user) {
  var app = angular.module('cellularAutomata', ['dragAndDropDirective', 'lifePatterns']);

  // set on click after angular is done with its ng-repeat
  app.directive('setClickHandler', function() {
    return function(scope, elem, attrs) {
      $(elem).click(function() {
        var shape = CAPredefinedShapes
                    .getCurrentSelected($(this).attr('data-ca-shape'));
        user.currentShape = shape;
      });
    };
  });
}(user));

