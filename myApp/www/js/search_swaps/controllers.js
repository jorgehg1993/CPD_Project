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

// Controller for the contact view where you can send a message to the owner of a swap
.controller('SearchSwapsContactsCtrl', function($scope, $localstorage, SERVER, $http, $stateParams, $state, $ionicLoading, $ionicHistory, searchService , $ionicPopup) {
    $scope.swap = searchService.selectedSwap; // view's variable to store information about the selected swap
    $scope.receiver = {}; // view's variable that stores the information about the user that receives a message
    $scope.message = {} // view's variable that stores the information about the message that is going to be sent

    // function that post a new message to database
    $scope.sendMessage = function(){
        $scope.message.receiverId = $scope.receiver._id;
        $scope.message.swapId = $scope.swap._id;
        $http.post(SERVER.url + '/api/message', $scope.message, {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data, status, headers, config){
            showAlert('Success', 'Message sent successfully');
            goLatestHomeView();
        })
        .error(function(data, status, headers, config){
            showAlert('Fail', "Message couldn't be sent, try again later");
        })
    }

    // function that changes to the home view 
    function goLatestHomeView(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.searchServices.home');
    }

    // function that shows an alert
    function showAlert(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    // function that initializes the view retrieving information about the receiver
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


