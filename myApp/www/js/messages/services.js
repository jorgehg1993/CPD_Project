angular.module('ionizer.servicemessages', ['ionizer.services'])

// This Factory provides API Calls
.factory('messagesService', function($http, $q, SERVER, utility, $localstorage) {
    
    var factoryObject = {
        received: [],
        sent: [],
        selectedMessage: {}
    };

    factoryObject.getReceivedMessages = function(){
        return $http.get(SERVER.url + '/api/messages/received', {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data){
            factoryObject.received  = data;
        });
    }

    factoryObject.getSentMessages = function(id){
        return $http.get(SERVER.url + '/api/messages/sent', {headers: {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data){
            factoryObject.sent  = data;
        });
    }




    return factoryObject;
})
