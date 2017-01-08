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
