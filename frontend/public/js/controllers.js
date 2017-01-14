angular.module('JNPAPP')
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