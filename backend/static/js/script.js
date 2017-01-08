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
        return $resource('/api/user/:username/friends/');
    }])
    .factory('CurrentUser', ['$resource', function($resource) {
        return $resource('/api/users/current/');
    }])
    .factory('CurrentUserPosts', ['$resource', function($resource) {
        return $resource('/api/users/current/posts/');
    }])
    .factory('UserFriends', ['$resource', function($resource) {
        return $resource('/api/user/current/friends/');
    }]);

angular.module('JNPAPP.auth', ['ngCookies', 'JNPAPP.api']).
    config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .controller('RegisterController', ['$scope', 'User', function($scope, User) {
        $scope.newUser = new User();
        $scope.Register = function() {
            $scope.newUser.$save().then(function (result) {
                    $scope.newUser = new User();
                    $scope.errors = null;
                }, function (rejection) {
                    $scope.errors = rejection.data;
                });
        }
    }])
    .controller('LoginController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
        $scope.user = new Object();
        $scope.user.username = null;
        $scope.user.password = null;
        $scope.loginError = null;

        $scope.Login = function(){
            var credentials = {username: $scope.user.username, password: $scope.user.password};
            $http.post('/api/token/auth/', credentials).then(function(data){
                        $scope.userToken = data.data.token;
                        $scope.loginError = null;
                        $cookies.put('Authorization', "Token " + $scope.userToken, {'path': '/'});
                        window.location.replace("/wall/")
                    }).then(function(){
                        $scope.loginError = null;
                    }, function(data) {
                        $scope.loginError = data.data;
                    });
        };

        $scope.Logout = function(){
            api.auth.logout(function(){
                $scope.user = undefined;
                $cookies.remove('Authorization');
            });
        };
    }])


angular.module('JNPAPP.wall', ['ngCookies', 'JNPAPP.api'])
    .service('authInterceptor', function($q) {
        this.responseError = function(response) {
            if(response.status == 401) {
                window.location = "/login/"
            }
            return $q.reject(response);
        }
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.interceptors.push('authInterceptor');
    }])
    .run(function($http, $cookies) {
        var auth = $cookies.get('Authorization');
        $http.defaults.headers.common['Authorization'] = auth ;
    })
    .controller('WallPostsController', ['$scope', 'CurrentUserPosts', function($scope, CurrentUserPosts) {
        $scope.posts = CurrentUserPosts.query();

        $scope.newPostError = null;
        $scope.newPost = new CurrentUserPosts();
        $scope.Post = function () {
            $scope.newPost.$save().then(function(result) {
                $scope.newPost = new CurrentUserPosts();
                $scope.posts.push(result);
            })
            .then(function() {
                    $scope.newPostError = null;
                },
                function(rejection) {
                    $scope.newPostError = rejection.data;
                }
            )
        };
    }])
    .controller('FriendsController', ['$scope', 'User', function($scope, User) {
        $scope.friends = UserFriends.query();

        $scope.newFriend = new User();

    }])
    .controller('CurrentUserController', ['$scope', 'CurrentUser', function($scope, CurrentUser) {
        return $scope.currentUser = CurrentUser.get();
    }]);