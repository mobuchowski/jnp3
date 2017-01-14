angular.module('JNPAPP')
    .service('authInterceptor', function($q) {
        this.responseError = function(response) {
            if(response.status == 401) {
                window.location = "/login/"
            }
            return $q.reject(response);
        }
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