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
    .controller('WallPostsController', ['$scope', 'UserPosts', function($scope, CurrentUserPosts) {
        $scope.posts = CurrentUserPosts.query({'username': 'current'});

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
    .controller('UserFriendsController', ['$scope', 'UserFriends', function($scope, UserFriends) {
        $scope.friends = UserFriends.query({'username': 'current'});

        $scope.newFriend = new UserFriends();
        $scope.newFriendError = null;
        $scope.AddFriend = function() {
            $scope.newFriend.$save({'username': 'current'}).then(function(result) {
                $scope.friends.push(result);
                $scope.newFriend = new UserFriends();
            }).then(function () {
                $scope.newFriendError = null;
            }, function (rejection) {
                $scope.newFriendError = rejection.data;
            });
        };
    }])
    .controller('CurrentUserController', ['$scope', 'User', function($scope, CurrentUser) {
        return $scope.currentUser = CurrentUser.get({'username': 'current'});
    }]);