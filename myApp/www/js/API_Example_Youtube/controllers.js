angular.module('ionizer.youtubecontroller', ['ionizer.services', 'ionizer.serviceyoutube'])

// Controller for the Youtube Home Page
.controller('YoutubeHomeCtrl', function($scope, $state, $http, $localstorage, latestService, utility, $ionicPopup) {
    $scope.DataAPI = [];
    $scope.allData = [];
    console.log('Entered to controller');
    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {
        $scope.allData = latestService.getLatestServices();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $scope.$broadcast('scroll.refreshComplete')
    }

    $scope.viewDetail = function(){
        $state.go('app.latestServices.home-detail');
    }

    // logic for rechache, current home page data will be kept for 10 minutes unless the user initiates a refresh
    var recache = false;

    if ($localstorage.get('cacheTime_youtube')) {
        var tChache = Date.parse($localstorage.get('cacheTime_youtube'));
        var tNow = new Date().getTime();

        if (parseInt((tNow - tChache) / (60 * 1000)) > 10) {
            $localstorage.set('cacheTime_youtube', Date());
            recache = true;
        }
    } else {
        $localstorage.set('cacheTime_youtube', Date());
        recache = true;
    }

    if (!$localstorage.getObject('cacheData_youtube').length) {
        recache = true;
    }

    // call Service to get Data
    if (recache) {

        $scope.allData = latestService.getLatestServices();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $localstorage.setObject('cacheData_youtube', $scope.allData);
        console.log(JSON.stringify($scope.allData, null, 4));
    } else {
        $scope.allData = $localstorage.getObject('cacheData_youtube');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_youtube'), 3);
    }
})

// Controller for Detail Pages used at every Tab
.controller('YoutubeDetailCtrl', function($scope, $http, $stateParams, latestService , $ionicPopup) {
    $scope.data = [];
    $scope.channel = [];
})
