var apiUrl = 'http://localhost:8000/api/'

angular.module('JNPAPP.api', ['ngResource'])
    .config(function($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .factory('User', ['$resource', function ($resource) {
        return $resource(apiUrl + 'users/:username/', {},
            {'save': {method: 'POST', url: "http://localhost:8000/api/users/create/"}}, {stripTrailingSlashes: false});
    }])
    .factory('Post', ['$resource', function($resource) {
        return $resource(apiUrl + 'posts/:id/', {id: '@id'});
    }])
    .factory('UserPosts', ['$resource', function($resource) {
        return $resource(apiUrl + 'users/:username/posts/');
    }])
    .factory('UserFriends', ['$resource', function($resource) {
        return $resource(apiUrl + 'users/:username/friends/');
    }])