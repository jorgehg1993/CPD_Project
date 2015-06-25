angular.module('ionizer.latestswapscontroller', ['ionizer.services', 'ionizer.servicelatestswaps'])

// Controller for the Latest swaps home page
.controller('LatestSwapsCtrl', function($scope, $state, $http, $localstorage, latestService, utility, $ionicPopup, SERVER) {
    $scope.swaps = []; // array variable to store all swaps retrieved from DB

    // function to retrieve the latest swaps in the database using the LatestSwaps Service
    latestService.getLatestSwaps()
    .then(function(){
        $scope.swaps = utility.partition(latestService.swaps, 3);
    })

    // function to refresh page when the view is swiped down
    $scope.doRefresh = function() {
        latestService.getLatestSwaps()
        .then(function(){
            $scope.swaps = utility.partition(latestService.swaps, 3);
        })
        $scope.$broadcast('scroll.refreshComplete')
    }

    // function to go to the Detail View
    $scope.viewDetail = function(){
        $state.go('app.latestServices.home-detail');
    }

})

// Controller for the detail view that shows more information of a selected swap
.controller('LatestSwapsDetailCtrl', function($scope, $http, $stateParams, $ionicLoading, $state, latestService , $ionicPopup) {
    $scope.swap = {}; // view variable to store the information of the swap selected

    // function that initializes the view variable
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

    // auxiliary function to show an alert
    $scope.showAlert = function(header, msg) {
        var alertPopup = $ionicPopup.alert({
            title: header,
            template: msg
        });
    };

    init();
})


// Controller for the contact view where you can send a message to the owner of a swap
.controller('LatestSwapsContactsCtrl', function($scope, $localstorage, SERVER, $http, $stateParams, $state, $ionicLoading, $ionicHistory, latestService , $ionicPopup) {
    $scope.swap = latestService.selectedSwap; // view's variable to store information about the selected swap
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
        $state.go('app.latestServices.home');
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

