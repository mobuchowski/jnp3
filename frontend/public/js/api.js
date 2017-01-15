var apiUrl = 'http://jnp3-dev.eu-central-1.elasticbeanstalk.com/api'

angular.module('JNPAPP.api', ['ngResource'])
    .config(function($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .factory('User', ['$resource', function ($resource) {
        return $resource(apiUrl + 'users/:username/', {},
            {'save': {method: 'POST', url: apiUrl + "/users/create/"}}, {stripTrailingSlashes: false});
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
