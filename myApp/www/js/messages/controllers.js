angular.module('ionizer.messagescontroller', ['ionizer.services', 'ionizer.servicemessages'])

// Controller for the Latest swaps home page
.controller('MessagesReceivedCtrl', function($scope, $state, $http, $localstorage, messagesService, utility, $ionicPopup, SERVER) {
    $scope.messages = []; // array variable to store all swaps retrieved from DB

    messagesService.getReceivedMessages()
    .then(function(){
        $scope.messages = utility.partition(messagesService.received, 3);
        console.log(JSON.stringify($scope.messages, null, 4))
    })


})

.controller('MessagesSentCtrl', function($scope, $state, $http, $localstorage, messagesService, utility, $ionicPopup, SERVER) {
    $scope.messages = []; // array variable to store all swaps retrieved from DB

    messagesService.getSentMessages()
    .then(function(){
        $scope.messages = messagesService.sent;
        console.log(JSON.stringify($scope.messages, null, 4))
    })
})