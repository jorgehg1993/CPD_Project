angular.module('ionizer.controllers', ['ionizer.services', 'ngOpenFB'])


.controller('AppCtrl', function($scope, ngFB, $http, SERVER, $ionicPopup, $localstorage, $ionicHistory, $state, $rootScope) {

    $rootScope.logged = false;
    $rootScope.user = undefined;
    $rootScope.profileImg = '';

    $scope.init = function(){
        var access_token = $localstorage.get('access_token');
        if(access_token !== undefined){
            $http.get(SERVER.url + '/api/profile', {headers: {'x-access-token': access_token}})
            .success(function(data, status, headers, config) {
                $rootScope.user = data;
                $rootScope.logged = true;
                $scope.setProfileImg();
            })
        }
    }

    $scope.setProfileImg = function(){
        if($rootScope.user){
            if($rootScope.user.facebook !== undefined)
                $rootScope.profileImg = "http://graph.facebook.com/"+ $rootScope.user.facebook.facebookId +"/picture?width=270&height=270";
            else
                $rootScope.profileImg = "img/avatars/avatar.jpg";
        }
    }

    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: msg
        });
    };    

    $scope.logOut = function(){
        $localstorage.destroy('access_token');
        $rootScope.user = undefined;
        $rootScope.logged = false;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.latestServices.home');
    }

    $scope.init();
})

.controller('LoginCtrl', function($scope, $state, ngFB, $ionicHistory, $http, SERVER, $ionicPopup, $rootScope, $localstorage) {
	$scope.loginData = {};

    $scope.register = function(){
		$state.go('app.register'); 
	}

    $scope.fbLogin = function () {
        ngFB.login({scope: 'email,read_stream,publish_actions'})
        .then(function (response) {
            if (response.status === 'connected') {
                $http.post(SERVER.url + '/api/fb-login', {access_token: response.authResponse.accessToken})
                .success(function(data, status, headers, config) {
                    $localstorage.set('access_token', data.token);
                    $rootScope.logged = true;
                    $scope.goProfile();
                })
                .error(function(data, status, headers, config) {
                    $scope.showAlert(data.message)
                });
            } else {
                $scope.showAlert('Facebook login failed');
            }
        });
    };

    $scope.login = function(){

        $http.post(SERVER.url + '/api/login', {email:$scope.loginData.email, password:$scope.loginData.password})
        .success(function(data, status, headers, config) {
            console.log(JSON.stringify(data, null, 4));
            $localstorage.set('access_token', data.token);
            $rootScope.logged = true;
            $scope.goProfile();
        })
        .error(function(data, status, headers, config) {
            $scope.showAlert(data.message)
        });
    }

    $scope.goProfile = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.profile');
    }

    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: msg
        });
    };
})

.controller('ProfileCtrl', function($scope, SERVER, $ionicHistory, $state, ngFB, $rootScope, $http, $ionicPopup, $ionicLoading, $localstorage) {

    $scope.$on('$ionicView.beforeEnter', function(){
        if($rootScope.logged)
            getUser();
        else
            goLoginView();
    });

    function getUser(){
        var access_token = $localstorage.get('access_token');
        $ionicLoading.show({
          template: 'Loading...'
        });
        $http.get(SERVER.url + '/api/profile', {headers: {'x-access-token': access_token}})
        .success(function(data, status, headers, config) {
            $ionicLoading.hide();
            $rootScope.user = data;
            $scope.setProfileImg();
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide();
            $scope.showAlert(data.message)
        });
    }

    function goLoginView(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.login');
    }
    
	$scope.edit = function(){
		$state.go('app.profile-edit'); 
	}

    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: msg
        });
    };

    $scope.setProfileImg = function(){
        if($rootScope.user){
            if($rootScope.user.facebook !== undefined)
                $rootScope.profileImg = "http://graph.facebook.com/"+ $rootScope.user.facebook.facebookId +"/picture?width=270&height=270";
            else
                $rootScope.profileImg = "img/avatars/avatar.jpg";
        }
    }
})


.controller('RegisterCtrl', function($scope, $state, Countries, SERVER, $rootScope, $http, $ionicPopup, $ionicHistory, $ionicLoading, $localstorage) {
	$scope.countries = Countries.getCountries();
    $scope.countries.shift();
    $scope.user = {};

    $scope.register = function(){
        $ionicLoading.show({
          template: 'Loading...'
        });
        console.log(JSON.stringify($scope.user, null, 4));
        $http.post(SERVER.url + '/api/register', $scope.user)
        .success(function(data, status, headers, config) {
            $rootScope.logged = true;
            $localstorage.set('access_token', data.token);
            $ionicLoading.hide();
            $scope.goProfile();
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide();
            $scope.showAlert(data.message)
        });
    }

    $scope.goProfile = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.profile');
    }

    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: msg
        });
    };
})

.controller('EditProfileCtrl', function($scope, $http, $state, Countries, $rootScope, $ionicHistory, $ionicLoading, SERVER, $ionicPopup, $localstorage) {
	$scope.countries = Countries.getCountries();
	$scope.countries.shift();
    //$scope.user = {};

    $scope.getUser = function(){

        $ionicLoading.show({
          template: 'Loading...'
        });

        $http.get(SERVER.url + '/api/profile', {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config) {
            $ionicLoading.hide();
            $rootScope.user = data;
            $rootScope.user.selectedCountry = $scope.countries[0];
        })
        .error(function(data, status, headers, config) {
            $ionicLoading.hide();
            $scope.showAlert(data.message)
        });
    }

    $scope.saveChanges = function(){
        var access_token = $localstorage.get('access_token');

        $http.put(SERVER.url + '/api/profile', $rootScope.user, {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config) {
            console.log(JSON.stringify(data, null, 4));
            $localstorage.set('access_token', data.token);
            $scope.goProfile();
        })
        .error(function(data, status, headers, config) {
            $scope.showAlert(data.message)
        });
    }

    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: msg
        });
    };

    $scope.goProfile = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.profile');
    }
})

.controller('ContactedServicesCtrl', function($scope, $state, $localstorage, utility, ContactedService) {
	$scope.DataAPI = [];
    $scope.allData = [];

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {
        $scope.allData = ContactedService.getSwaps();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $scope.$broadcast('scroll.refreshComplete')
    }

    // logic for rechache, current home page data will be kept for 10 minutes unless the user initiates a refresh
    var recache = false;

    if ($localstorage.get('cacheTime_youtube')) {
        var tChache = Date.parse($localstorage.get('cacheTime_youtube'));
        var tNow = new Date().getTime();

        if (parseInt((tNow - tChache) / (60 * 1000)) > 10) {
            $localstorage.set('cacheTime_youtube', Date());
            recache = true;
        }
    } else {
        $localstorage.set('cacheTime_youtube', Date());
        recache = true;
    }

    if (!$localstorage.getObject('cacheData_youtube').length) {
        recache = true;
    }

    // call Service to get Data
    if (recache) {

        $scope.allData = ContactedService.getSwaps();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $localstorage.setObject('cacheData_youtube', $scope.allData);
    } else {
        $scope.allData = $localstorage.getObject('cacheData_youtube');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_youtube'), 3);
    }
})

.controller('ContactedServicesDetailCtrl', function($scope, $state) {

})
