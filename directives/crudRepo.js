angular.module('mcc').directive("mccCrudRepo", ['$http',
  '$location',
  'mcc.toasterTranslate',
  function ($http, $location, toasterTranslate) {
    return {restrict: 'A',
      scope: '@',
      link: function ($scope, element, attrs) {
        $scope.update = function (obj) {
          $http({
            method: 'PUT',
            data: obj,
            url: attrs.mccCrudRepo + '/' + obj.id
          }).success(function (data, status, headers, config) {
            toasterTranslate.success(data.dict);
          }).error(function (data, status, headers, config) {

          });
        }
        $scope.create = function (obj) {
          $http({
            method: 'POST',
            data: obj,
            url: attrs.mccCrudRepo
          }).success(function (data, status, headers, config) {
            toasterTranslate.success(data.dict);
            if ('mccCrudRepoCreateLocation' in attrs) {
              $location.path(attrs.mccCrudRepoCreateLocation);
            }
          }).error(function (data, status, headers, config) {

          });
        }
        $scope.get = function (id) {

        }
        $scope.delete = function (id) {
          $http({
            method: 'DELETE',
            url: attrs.mccCrudRepo + '/' + id
          }).success(function (data, status, headers, config) {
            toasterTranslate.success(data.dict);
            if ('mccCrudRepoCreateLocation' in attrs) {
              $location.path(attrs.mccCrudRepoDeleteLocation);
            }
          }).error(function (data, status, headers, config) {

          });
        }
      }
    };
  }]);

