angular.module('ionizer.searchswapscontroller', ['ionizer.services', 'ionizer.servicesearch'])

// Controller for the Home Page
.controller('SearchSwapsHomeCtrl', function($scope, $http, $cordovaGeolocation, $localstorage, searchService, Countries, utility, $ionicLoading, $ionicModal) {
    $scope.swaps = [];
    $scope.query = "";
    $scope.resultsFound = true;

    $scope.viewDetail = function(){
        $state.go('app.searchService.home-detail');
    }

    $scope.searchSwaps = function(query){

        if(query == ""){
            getSwaps($scope.lat, $scope.lon)
        }else{
            var sQuery = query.split(' ').join('+');
            searchService.searchSwapsWithLocation($scope.lat, $scope.lon, sQuery)
            .then(function(){
                $scope.swaps = utility.partition(searchService.swaps, 3);
                if($scope.swaps.length == 0)
                    $scope.resultsFound = false
                else
                    $scope.resultsFound = true;
            }, function(){
                $scope.resultsFound = false;
            })
        }
        //cordova.plugins.Keyboard.close();
    }

    function getSwaps(lat, lon){
        if(typeof lat !== 'undefined' && typeof lon !== 'undefined'){
            searchService.getSwapsByLocation($scope.lat, $scope.lon)
            .then(function(){
                $scope.swaps = utility.partition(searchService.swaps, 3);
                $scope.resultsFound = true;
            }, function(){
                $scope.resultsFound = false;
            })
        }else{
            searchService.getSwaps()
            .then(function(){
                $scope.swaps = utility.partition(searchService.swaps, 3);
                $scope.resultsFound = true;
            }, function(){
                $scope.resultsFound = false;
            })
        }
    }

    function init(){
        var posOptions = {timeout: 10000, enableHighAccuracy: false};

        $ionicLoading.show({
            template: "Getting your current location..."
        });

        $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (position) {
            $scope.lat  = position.coords.latitude
            $scope.lon = position.coords.longitude

            searchService.getSwapsByLocation($scope.lat, $scope.lon)
            .then(function(){

                $scope.swaps = utility.partition(searchService.swaps, 3);

                $ionicLoading.hide();
            }, function(){
                $scope.resultsFound = false;
                $ionicLoading.hide();
            })


        }, function(err) {
            searchService.getSwaps()
            .then(function(){
                $scope.swaps = utility.partition(searchService.swaps, 3);
                $ionicLoading.hide();
            }, function(){
                $scope.resultsFound = false;
                $ionicLoading.hide();
            })
        });

    }

    init();
})

// Controller for Detail Pages used at every Tab
.controller('SearchSwapsDetailCtrl', function($scope, $http, searchService, $ionicLoading, $ionicPopup, $stateParams) {
    $scope.swap = {};

    $scope.loadSwap = function(){

        $ionicLoading.show({
            template: 'Loading...'
        });

        searchService.getSwapById($stateParams.id)
        .then(function(){
            $scope.swap = searchService.selectedSwap;
            $ionicLoading.hide();
        }, function(){
            $ionicLoading.hide();
        })
    }

    $scope.showAlert = function(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    $scope.loadSwap();
})
