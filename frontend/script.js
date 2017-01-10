angular.module('JNPAPP', ['ngCookies', 'ui.router', 'JNPAPP.api'])
    .service('authInterceptor', function($q) {
        this.responseError = function(response) {
            if(response.status == 401) {
                window.location = "/login/"
            }
            return $q.reject(response);
        }
    })
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function($httpProvider, $stateProvider, $urlRouterProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.interceptors.push('authInterceptor');

        $stateProvider
            .state('wall', {
                url: '/',
                templateUrl: 'pages/wall.html',
                controller: 'WallPostsController'
            })
            .state('userDetails', {
                url: '/user/:username',
                templateUrl: 'pages/userDetail.html',
                controller: 'UserDetailController'
            })
            .state('userDetails.posts', {
                url: '/posts',
                views: {
                    'content': {
                        templateUrl: 'pages/postList.html',
                        controller: 'UserPostsController',
                    }
                }
            })
            .state('userDetails.friends', {
                url: '/friends',
                views: {
                    'content': {
                        templateUrl: 'pages/friendList.html',
                        controller: 'UserFriendsController'
                    }
                }
            })
       $urlRouterProvider.otherwise('/');
    }])
    .run(function($http, $cookies) {
        var auth = $cookies.get('Authorization');
        $http.defaults.headers.common['Authorization'] = auth ;
    })
    .service('UserService', ['User', 'UserPosts', 'UserFriends', function(User, UserPost, UserFriends) {
        this.getUser = function(username) {
            return User.get({'username': username});
        };

        this.getPosts = function(username) {
            return UserPost.query({'username': username});
        };

        this.getFriends = function(username) {
            this.friends = UserFriends.query({'username': username});
            return this.friends;
        };
    }])
    .service('CurrentUserService', ['User', 'UserPosts', 'UserFriends', 'Post', function(User, UserPost, UserFriends, Post) {
        this.getUser = function() {
            return User.get({'username': 'current'});
        };

        this.getPosts = function() {
            return UserPost.query({'username': 'current'});
        };

        this.newPostError = null;
        this.newPost = new Post();
        this.Post = function () {
            this.newPost.$save().then(function(result) {
                this.newPost = new Post();
                this.posts.unshift(result);
            })
            .then(function() {
                    this.newPostError = null;
                },
                function(rejection) {
                    this.newPostError = rejection.data;
                }
            )
        };

        var friends = UserFriends.query({'username': 'current'});

        this.getFriends = function() {
            return friends;
        };
    }])
    .controller('CurrentUserFriendsController', ['$scope', 'CurrentUserService', 'UserFriends', function($scope, CurrentUserService, UserFriends) {
        $scope.friends = CurrentUserService.getFriends();
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
    .controller('CurrentUserController', ['$scope', 'CurrentUserService', function($scope, CurrentUserService) {
        $scope.currentUser = CurrentUserService.getUser();
        $scope.currentUser.$promise.then(function (response) {
            $scope.username = response.username;
        })
        $scope.friends = CurrentUserService.getFriends();
    }])
    .controller('WallPostsController', ['$scope', 'CurrentUserService', function($scope, CurrentUserService) {
        $scope.posts = CurrentUserService.getPosts();
        $scope.Post = CurrentUserService.addPost;
    }])
    .controller('UserDetailController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
        $scope.username = $stateParams.username;
    }])
    .controller('UserPostsController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
        $scope.posts = UserService.getPosts($stateParams.username);
    }])
    .controller('UserFriendsController', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
        $scope.friends = UserService.getFriends($stateParams.username);
    }])