angular.module('JNPAPP.api', ['ngResource'])
    .config(function($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .factory('User', ['$resource', function ($resource) {
        return $resource('/api/users/:username/', {},
            {'save': {method: 'POST', url: "/api/users/create/"}}, {stripTrailingSlashes: false});
    }])
    .factory('Post', ['$resource', function($resource) {
        return $resource('/api/posts/:id/', {id: '@id'});
    }])
    .factory('UserPosts', ['$resource', function($resource) {
        return $resource('/api/users/:username/posts/');
    }])
    .factory('UserFriends', ['$resource', function($resource) {
        return $resource('/api/users/:username/friends/');
    }])