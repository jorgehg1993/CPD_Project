angular.module('ionizer.servicelatestswaps', ['ionizer.services'])

// This Factory provides API Calls
.factory('latestService', function($http, $q, SERVER, utility) {
    var factoryObject = {
        swaps: [],
        selectedSwap: {}
    };

    factoryObject.getLatestSwaps = function(){
        return $http({
            method: 'GET',
            url: SERVER.url + '/api/swaps/latest'
        }).success(function(data){
            factoryObject.swaps  = data;
        });
    }

    factoryObject.getSwapById = function(id){
        return $http.get(SERVER.url + '/api/swap/' + id)
        .success(function(data){
            factoryObject.selectedSwap  = data;
        });
    }



    return factoryObject;
})
