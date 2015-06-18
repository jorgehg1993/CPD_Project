angular.module('ionizer.myswapscontroller', ['ionizer.services', 'ionizer.servicemyswaps'])

// Controller for the Home Page
.controller('MySwapsCtrl', function($scope, $state, $ionicHistory, $http, $rootScope, $ionicLoading, MySwapsService, $localstorage, MySwapsService, utility) {
    $scope.swaps = [];

    $scope.$on('$ionicView.beforeEnter', function(){
        if($rootScope.logged)
            loadSwaps();
        else
            goLoginView();
    });

    function loadSwaps(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        MySwapsService.getMySwaps()
        .then(function(){
            $ionicLoading.hide();
            $scope.swaps = utility.partition(MySwapsService.mySwaps, 3);
        })
    }

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {
        MySwapsService.getMySwaps()
        .then(function(){
            $scope.swaps = utility.partition(MySwapsService.mySwaps, 3);
        })
        $scope.$broadcast('scroll.refreshComplete')
    }

    $scope.viewDetail = function(){
        $state.go('app.latestServices.home-detail');
    }

    function goLoginView(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.login');
    }
})

// Controller for Detail Pages used at every Tab
.controller('MySwapsDetailCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $localstorage, SERVER, $ionicLoading, $http, MySwapsService, $stateParams, MySwapsService) {

    $scope.swap = {};
    $scope.user = {};

    $scope.loadSwap = function(){

        $ionicLoading.show({
            template: 'Loading...'
        });

        MySwapsService.getSwapById($stateParams.id)
        .then(function(){
            $scope.swap = MySwapsService.selectedSwap;
            $ionicLoading.hide();
        }, function(){
            $ionicLoading.hide();
        })
    }

    $scope.deleteSwap = function(){
        $scope.showConfirm('Delete swap', 'Are you sure you want to delete this swap');
    }

    $scope.sendDelete = function(){
        $http.delete(SERVER.url + '/api/swap/' + $stateParams.id, {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config){
            $scope.showAlert('Success', "Swap deleted successfully");
            $scope.goMySwaps();
        })
        .error(function(data, status, headers, config){
             $scope.showAlert('Error', data.message);
        })
    }

    $scope.showAlert = function(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    $scope.showConfirm = function(header, message) {
        var confirmPopup = $ionicPopup.confirm({
            title: header,
            template: message
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.sendDelete();
            } else {
                console.log('Swap not deleted');
            }
        });
    };

    $scope.goMySwaps = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.myServices.home');
    }

    $scope.loadSwap();

})

.controller('MySwapsEditCtrl', function($scope, MySwapsService, GEOLOCATION, SERVER, $localstorage, $ionicPopup, $ionicHistory, $state, $ionicLoading, $http, $stateParams, Countries) {
    $scope.countries = Countries.getCountries();
    $scope.swap = {};
    $scope.swap.country = $scope.countries[0];

     $scope.saveChanges = function(){
        if($scope.swap.country === "Worldwide")
            $scope.saveSwap();
        else
            $scope.loadCoordinates();
    }

    $scope.saveSwap = function(){
        $http.put(SERVER.url + '/api/swap/' + $stateParams.id, $scope.swap, {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config){
            $scope.showAlert('Success', "The changes were saved successfully");
            $scope.goMySwaps();
        })
        .error(function(data, status, headers, config){
             $scope.showAlert('Error', data.message);
        })
    }

    $scope.loadCoordinates = function(){
        var city = $scope.swap.city.replace(/ /g,"+");
        var state = $scope.swap.state.replace(/ /g, "+");
        var country = $scope.swap.country.replace(/ /g, "+");
        var geo_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',+' + state + ',+' + country + '&key=' + GEOLOCATION.key;
        $http.get(geo_url)
        .success(function(data, status, headers, config) {
            if(data.status === 'OK'){
                $scope.swap.latitude = data.results[0].geometry.location.lat;
                $scope.swap.longitude = data.results[0].geometry.location.lng;
                $scope.saveSwap();
            }else{
                $scope.showAlert('Error', "The swap couldn't be created. Try again later.");   
            }
        })
        .error(function(data, status, headers, config) {
            $scope.showAlert('Error', "The swap couldn't be created. Try again later.");
        });
    }

    $scope.showAlert = function(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    $scope.goMySwaps = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.myServices.home');
    }

    $scope.loadSwap = function(){

        $ionicLoading.show({
            template: 'Loading...'
        });

        MySwapsService.getSwapById($stateParams.id)
        .then(function(){
            $scope.swap = MySwapsService.selectedSwap;
            $ionicLoading.hide();
        }, function(){
            $ionicLoading.hide();
        })
    }


    $scope.loadSwap();
})

.controller('MySwapsCreateCtrl', function($scope, $ionicHistory, $state, $ionicPopup, $http, $stateParams, $localstorage, SERVER, GEOLOCATION, MySwapsService, Countries) {
    $scope.countries = Countries.getCountries();
    $scope.swap = {};
    $scope.swap.country = $scope.countries[0].name;

    $scope.createSwap = function(){
        if($scope.swap.country === "Worldwide")
            $scope.saveSwap();
        else
            $scope.loadCoordinates();
    }

    $scope.saveSwap = function(){
        console.log('Object to be sent: ');
        console.log(JSON.stringify($scope.swap));
        $http.post(SERVER.url + '/api/swap', $scope.swap, {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config){
            $scope.showAlert('Success', "The swap was created successfully");
            $scope.goMySwaps();
        })
        .error(function(data, status, headers, config){
             $scope.showAlert('Error', data.message);
        })
    }

    $scope.loadCoordinates = function(){
        var city = $scope.swap.city.replace(/ /g,"+");
        var state = $scope.swap.state.replace(/ /g, "+");
        var country = $scope.swap.country.replace(/ /g, "+");
        var geo_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',+' + state + ',+' + country + '&key=' + GEOLOCATION.key;
        $http.get(geo_url)
        .success(function(data, status, headers, config) {
            if(data.status === 'OK'){
                $scope.swap.latitude = data.results[0].geometry.location.lat;
                $scope.swap.longitude = data.results[0].geometry.location.lng;
                $scope.saveSwap();
            }else{
                $scope.showAlert('Error', "The swap couldn't be created. Try again later.");   
            }
        })
        .error(function(data, status, headers, config) {
            $scope.showAlert('Error', "The swap couldn't be created. Try again later.");
        });
    }

    $scope.showAlert = function(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    $scope.goMySwaps = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.myServices.home');
    }
})
