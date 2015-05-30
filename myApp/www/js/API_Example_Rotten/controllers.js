angular.module('ionizer.rottencontroller', ['ionizer.services', 'ionizer.servicerotten'])

// Controller for the Home Page
.controller('RottenHomeCtrl', function($scope, $http, $localstorage, searchService, Countries, utility, $ionicModal) {
    $scope.DataAPI = [];
    $scope.allData = [];

    $scope.countries = Countries.getCountries();

    $scope.selectedCountry = $scope.countries[0];

    $ionicModal.fromTemplateUrl('templates/filter.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.showFilter = function() {
        $scope.modal.show();
    };

    $scope.order = {
        value: 'location'
    };

    $scope.applyFilter = function(){
        console.log($scope.order.value);
    }

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {
        $scope.allData = searchService.getServicesbySearch();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $scope.$broadcast('scroll.refreshComplete')
    }

    $scope.viewDetail = function(){
        $state.go('app.searchServices.home-detail');
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

        $scope.allData = searchService.getServicesbySearch();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $localstorage.setObject('cacheData_youtube', $scope.allData);
        console.log(JSON.stringify($scope.allData, null, 4));
    } else {
        $scope.allData = $localstorage.getObject('cacheData_youtube');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_youtube'), 3);
    }
})

// Controller for Detail Pages used at every Tab
.controller('RottenDetailCtrl', function($scope, $http, $stateParams) {
    $scope.data = [];
    $scope.channel = [];
})
