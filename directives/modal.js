angular.module('mcc').directive("mccModal", [
  '$modal',
  function ($modal) {
    return {
      restrict: "A",
      scope: {
        data: '=mccModalData'
      },
      link: function ($scope, element, attrs) {
        element.bind('click', function () {
          var modalInstance;
          modalInstance = $modal.open({
            templateUrl: attrs.mccModal,
            size: attrs.mccModalSize,
            controller: attrs.mccModalController,
            resolve: {
              data: function () {
                return $scope.data;
              },
              modalInstance: function () {
                return modalInstance;
              }
            }
          });
        });
      }
    };
  }]);