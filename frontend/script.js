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
        var user = User.get({'username': 'current'});
        this.getUser = function() {
            return user;
        };

        this.getPosts = function() {
            return UserPost.query({'username': 'current'});
        };

        this.getFriends = function() {
            return UserFriends.query({'username': 'current'});
        };

        this.addFriend = function(newFriend, onSuccess, onError) {
            newFriend.$save({'username': 'current'}).then(function(result) {
                onSuccess(result);
            }).then(function () {
            }, function (rejection) {
                onError(rejection);
            });
        }
    }])
    .service('WallService', ['$http', 'Post', function($http, Post) {
        this.getPosts = function(pageNumber, onSuccess, onError) {
            if(pageNumber == 0)
                return;
            $http({
                method: 'GET',
                url: apiUrl + 'wallPosts/',
                params: {
                    page: pageNumber
                },
            }).then(function(response) {
                onSuccess(response.data.results);
            }).then( function(){}, function(rejection) {
                onError(rejection);
            })
        };

        this.addPost = function (post, onSuccess, onError) {
            post.$save().then(function(result) {
                onSuccess(result);
            })
            .then(function() {},
                function(rejection) {
                    onError(rejection);
                }
            )
        };

        return this;
    }])
    .controller('CurrentUserController', ['$scope', 'CurrentUserService', 'UserFriends', function($scope, CurrentUserService, UserFriends) {
        $scope.currentUser = CurrentUserService.getUser();
        $scope.currentUser.$promise.then(function (response) {
            $scope.username = response.username;
        })
        $scope.friends = CurrentUserService.getFriends();
        $scope.newFriend = new UserFriends();
        $scope.newFriendError = null;

        $scope.addFriend = function() {
            CurrentUserService.addFriend($scope.newFriend, function(result) {
                $scope.friends.push(result);
                $scope.newFriend = new UserFriends();
                $scope.newFriendError = null;
            },
            function (rejection) {
                $scope.newFriendError = rejection.data;
            });
        };

    }])
    .controller('WallPostsController', ['$scope', 'WallService', 'Post', function($scope, WallService, Post) {
        $scope.posts = [];
        $scope.newPost = new Post();
        $scope.newPostError = null;
        $scope.pageNumber = 1;
        var onPostsLoad = function(result) {
            Array.prototype.push.apply($scope.posts, result);
            $scope.pageNumber++;
        };

        var onPostsLoadError= function(rejection) {
            if(rejection.status == 404)
                $scope.pageNumber = 0;
            else
                $scope.postsLoadError = rejection.data;
        }

        var onNewPost = function(result) {
            $scope.newPost = new Post();
            $scope.newPostError = null;
            $scope.posts.unshift(result);
        }

        var onNewPostError = function(rejection) {
            $scope.newPostError = rejection.data;
        }

        $scope.getPosts = function() {
            WallService.getPosts($scope.pageNumber, onPostsLoad, onPostsLoadError);
        }

        $scope.Post = function () {
            WallService.addPost($scope.newPost, onNewPost, onNewPostError);
        }

        $scope.getPosts();
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