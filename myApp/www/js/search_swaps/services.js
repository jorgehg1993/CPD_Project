angular.module('ionizer.servicesearch', ['ionizer.services'])

// This Factory provides API Calls
.factory('searchService', function($http, $q, utility, SERVER, $filter) {
    var factoryObject = {
        swaps: [],
        selectedSwap: {}
    };

    factoryObject.getSwapsByLocation = function(lat, lon){
        return $http({
            method: 'GET',
            url: SERVER.url + '/api/swaps/location?lat=' + lat + "&lon=" + lon
        }).success(function(data){
            factoryObject.swaps  = $filter('orderBy')(data, 'distance');
        });
    }

    factoryObject.getSwaps = function(){
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
            factoryObject.selectedSwap = data;
        });
    }


    factoryObject.searchSwapsWithLocation = function(lat, lon, query){
        return $http.get(SERVER.url + '/api/swaps/search/location?lat=' + lat + '&lon=' + lon + '&sQuery=' + query)
        .success(function(data){
            factoryObject.swaps.length = 0;
            for(var i = 0; i<data.results.length; i++){
                factoryObject.swaps.push(data.results[i].obj);
            }
            $filter('orderBy')(factoryObject.swaps, 'distance');
        });
    }

    return factoryObject;
})