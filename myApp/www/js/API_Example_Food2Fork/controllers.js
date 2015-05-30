angular.module('ionizer.food2forkcontroller', ['ionizer.services','ionizer.servicefood2fork'])

// Controller for the Home Page
.controller('Food2ForkHomeCtrl', function($scope, $http, $localstorage, food2forkService, utility) {
    $scope.DataAPI = [];
    $scope.allData = [];
    $scope.checkedData = [];


    // Get the checked data from Cache and put into the $scope
    utility.readyCheckBoxes($scope.checkedData, $localstorage.getObject('memoryData_Food2Fork'));

    // function run everytime a checkbox is clicked
    $scope.saveCheck = function() {

        responseData = utility.saveCheckBoxes($scope.checkedData, $scope.allData, $localstorage.getObject('memoryData_Food2Fork'), $localstorage.getObject('ObjectData_Food2Fork'));
        $localstorage.setObject('memoryData_Food2Fork', responseData.data);
        $localstorage.setObject('ObjectData_Food2Fork', responseData.dataObject);

    }

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {

        food2forkService.callAPI('Home').then(
            function(returnData) {
                $localstorage.setObject('cacheData_Food2Fork', returnData);
                $scope.allData = returnData;
                $scope.DataAPI = utility.partition(returnData, 3);
            }
        ).finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
        });

    }

    // logic for rechache, current home page data will be kept for 10 minutes unless the user initiates a refresh
    var recache = false;

    if ($localstorage.get('cacheTime_Food2Fork')) {
        var tChache = Date.parse($localstorage.get('cacheTime_Food2Fork'));
        var tNow = new Date().getTime();

        if (parseInt((tNow - tChache) / (60 * 1000)) > 10) {
            $localstorage.set('cacheTime_Food2Fork', Date());
            recache = true;
        }
    } else {
        $localstorage.set('cacheTime_Food2Fork', Date());
        recache = true;
    }

    if (!$localstorage.getObject('cacheData_Food2Fork').length) {
        recache = true;
    }

    // call Service to get Data
    if (recache) {

        food2forkService.callAPI('Home').then(
            function(returnData) {
                $localstorage.setObject('cacheData_Food2Fork', returnData);
                $scope.DataAPI = utility.partition(returnData, 3);
                $scope.allData = returnData;

            }
        );
    } else {
        $scope.allData = $localstorage.getObject('cacheData_Food2Fork');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_Food2Fork'), 3);
    }
})

// Controller for Detail Pages used at every Tab
.controller('Food2ForkDetailCtrl', function($scope, $http, $stateParams, food2forkService) {
    $scope.data = [];

    food2forkService.setID($stateParams.dataID);
    
    food2forkService.callAPI('Detail').then(
        function(returnData) {
            $scope.data = returnData;
        }
    );
})

// Controller for Search Page
.controller('Food2ForkSearchCtrl', function($scope, $http, $timeout, $localstorage, food2forkService, utility) {
    $scope.DataAPI = [];
    $scope.allData = [];

    $scope.checkedData = [];
    $scope.hasMoreData = false;

    // Get the checked data from Cache and put into the $scope
    utility.readyCheckBoxes($scope.checkedData, $localstorage.getObject('memoryData_Food2Fork'));

    // function run everytime a checkbox is clicked
    $scope.saveCheck = function() {
        responseData = utility.saveCheckBoxes($scope.checkedData, $scope.DataAPI, $localstorage.getObject('memoryData_Food2Fork'), $localstorage.getObject('ObjectData_Food2Fork'));
        $localstorage.setObject('memoryData_Food2Fork', responseData.data);
        $localstorage.setObject('ObjectData_Food2Fork', responseData.dataObject);
    }

    $scope.loadMore = function() {
        console.log('Loadmore');

        food2forkService.setPage();
        food2forkService.callAPI('Search').then(
            function(returnData) {

                if (returnData.length) {
                    for (var i = 0; i < returnData.length; i++) {
                        $scope.allData.push(returnData[i]);
                    }
                    $scope.DataAPI = utility.partition($scope.allData, 3);
                    $scope.hasMoreData = true;

                } else {
                    $scope.hasMoreData = false;
                }
            }
        ).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete')
        });
    };

    // using watch so that APICall will not be sent unless the users has stopper typing for 1000ms
    $scope.$watch('query', function(tmpStr) {

        // if the search query is empty, do nothing
        if (!tmpStr || tmpStr.length == 0) {
            return 0;
        }


        setTimeout(function() {

            // if searchStr is still the same..
            // go ahead and retrieve the data
            if (tmpStr === $scope.query) {

                food2forkService.setPage(0);
                food2forkService.setQuery($scope.query);
                $scope.allData = [];
                console.log('Calling Load More from Search Query');
                $scope.loadMore();

            }
        }, 1000);


    });

})

// controller for bookmark page, shows data based on local storage
.controller('Food2ForkBookmarkCtrl', function($scope, $localstorage) {
    $scope.DataAPI = $localstorage.getObject('ObjectData_Food2Fork');
});
