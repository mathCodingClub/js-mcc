angular.module('mcc').service('mcc.newsData', function ($http, $q, $localStorage) {

  var get = function (url) {
    return function () {
      var request = $http({
        method: 'get',
        url: url
      });
      return request.then(handleSuccess, handleError);
    };
  };

  var init = function () {
    var data = $localStorage.news;
    var latestTimestamp = $localStorage.newsTimestamp;
    var timeStamp = new Date().getTime();
    if (data == null || data.news == null || data.news.length == 0 || (timeStamp - data.updated) > 1000 * 600) {
      return getTitles(0);
    }
    var fun = get('rest/mcc/news/latest/timestamp');
    var deferred = $q.defer();
    fun().then(function (entry) {
      if (latestTimestamp == entry.timestamp) {
        deferred.resolve(data);
      } else {
        var recent = getTitles();
        recent.then(function (data) {
          deferred.resolve(data);
        });
      }
    });
    return deferred.promise;
  };

  var saveToLocalStorage = function (data) {
    data.updated = new Date().getTime();
    $localStorage.news = data;
  };

  var reset = function () {
    delete $localStorage.news;
  };

  var getTitles = function (from) {
    from = (arguments.length === 1) ? from : 0;
    if (from == 0) {
      var latest = get('rest/mcc/news/latest/timestamp');
      latest().then(function (data) {
        $localStorage.newsTimestamp = data.timestamp;
      });
    }
    var fun = get('rest/mcc/news/titles/' + from);
    return fun();
  };


  var getById = function (id) {
    var fun = get('rest/mcc/news/' + id);
    return fun();
  };

  var handleSuccess = function (response) {
    return response.data;
  };

  var handleError = function (response) {    
    if (!angular.isObject(response.data) || !response.data.message) {
      return $q.reject("An unknown error occurred.");
    }
    // Otherwise, use expected error message.
    return $q.reject(response.data.message);
  };

  // init interface
  return {
    getTitles: getTitles,
    getById: getById,
    init: init,
    saveToLocalStorage: saveToLocalStorage,
    reset: reset
  };

});