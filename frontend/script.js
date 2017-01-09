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
                views: {
                    '': {
                        templateUrl: 'pages/wall.html',
                        controller: 'WallPostsController'
                    }
                }
            })

       $urlRouterProvider.otherwise('/');
    }])
    .run(function($http, $cookies) {
        var auth = $cookies.get('Authorization');
        $http.defaults.headers.common['Authorization'] = auth ;
    })
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

        this.getFriends = function() {
            this.friends = UserFriends.query({'username': 'current'});
            return this.friends;
        };

        this.newFriend = new UserFriends();
        this.newFriendError = null;

        this.addFriend = function() {
            this.newFriend.$save({'username': 'current'}).then(function(result) {
                this.friends.push(result);
                this.newFriend = new UserFriends();
            }).then(function () {
                this.newFriendError = null;
            }, function (rejection) {
                this.newFriendError = rejection.data;
            });
        };
    }])
    .controller('UserFriendsController', ['$scope', 'CurrentUserService', function($scope, CurrentUserService) {
        $scope.friends = CurrentUserService.getFriends();
        $scope.AddFriend = CurrentUserService.addFriend;
    }])
    .controller('CurrentUserController', ['$scope', 'CurrentUserService', function($scope, CurrentUserService) {
        $scope.currentUser = CurrentUserService.getUser();
    }])
    .controller('WallPostsController', ['$scope', 'CurrentUserService', function($scope, CurrentUserService) {
        $scope.posts = CurrentUserService.getPosts();
        $scope.Post = CurrentUserService.addPost;
    }])