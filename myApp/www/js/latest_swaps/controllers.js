angular.module('ionizer.latestswapscontroller', ['ionizer.services', 'ionizer.servicelatestswaps'])

// Controller for the Youtube Home Page
.controller('LatestSwapsCtrl', function($scope, $state, $http, $localstorage, latestService, utility, $ionicPopup, SERVER) {
    $scope.swaps = [];

    latestService.getLatestSwaps()
    .then(function(){
        $scope.swaps = utility.partition(latestService.swaps, 3);
    })

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {
        latestService.getLatestSwaps()
        .then(function(){
            $scope.swaps = utility.partition(latestService.swaps, 3);
        })
        $scope.$broadcast('scroll.refreshComplete')
    }

    $scope.viewDetail = function(){
        $state.go('app.latestServices.home-detail');
    }

})

// Controller for Detail Pages used at every Tab
.controller('LatestSwapsDetailCtrl', function($scope, $http, $stateParams, $ionicLoading, $state, latestService , $ionicPopup) {
    $scope.swap = {};
    $scope.user = {};

    function init(){

        $ionicLoading.show({
            template: 'Loading...'
        });

        latestService.getSwapById($stateParams.id)
        .then(function(){
            $scope.swap = latestService.selectedSwap;
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

    init();
})

.controller('LatestSwapsContactsCtrl', function($scope, $localstorage, SERVER, $http, $stateParams, $ionicLoading, latestService , $ionicPopup) {
    $scope.swap = latestService.selectedSwap;
    $scope.receiver = {};


    $scope.showAlert = function(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    function init(){
        $http.get(SERVER.url + '/api/receiver/' + $stateParams.receiverId, {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config){
            $scope.receiver = data;
        })
        .error(function(data, status, headers, config){

        })
    }

    init()
})

