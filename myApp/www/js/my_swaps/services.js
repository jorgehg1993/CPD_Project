angular.module('ionizer.servicemyswaps', ['ionizer.services'])

// This Factory provides API Calls
.factory('MySwapsService', function($http, SERVER, $localstorage, $q, utility) {
    var factoryObject = {
        mySwaps: [],
        selectedSwap: {}
    };

    factoryObject.getMySwaps = function(){
        return $http.get(SERVER.url + '/api/mySwaps', {headers : {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data){
            factoryObject.mySwaps  = data;
        });
    }

    factoryObject.getSwapById = function(id){
        return $http.get(SERVER.url + '/api/mySwaps/' + id, {headers : {'x-access-token': $localstorage.get('access_token')}})
        .success(function(data){
            factoryObject.selectedSwap  = data;
        });
    }

    return factoryObject;
})
