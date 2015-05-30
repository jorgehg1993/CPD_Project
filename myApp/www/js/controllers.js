angular.module('ionizer.controllers', ['ionizer.services'])


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('TabsPageController', ['$scope', '$state', function($scope, $state) {}])

.controller('LoginCtrl', function($scope, $state) {
	$scope.register = function(){
		$state.go('app.register'); 
	}
})

.controller('ProfileCtrl', function($scope, $state) {

	$scope.edit = function(){
		$state.go('app.profile-edit'); 
	}
})


.controller('RegisterCtrl', function($scope, $state, Countries) {
	$scope.countries = Countries.getCountries();

	$scope.selectedCountry = $scope.countries[0];
})

.controller('EditProfileCtrl', function($scope, $state, Countries) {
	$scope.countries = Countries.getCountries();

	$scope.selectedCountry = $scope.countries[0];
})

.controller('ContactedServicesCtrl', function($scope, $state, $localstorage, utility, ContactedService) {
	$scope.DataAPI = [];
    $scope.allData = [];

    // function to run everytime the user "pulls to refresh"
    $scope.doRefresh = function() {
        $scope.allData = ContactedService.getSwaps();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $scope.$broadcast('scroll.refreshComplete')
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

        $scope.allData = ContactedService.getSwaps();
        $scope.DataAPI = utility.partition($scope.allData, 3);
        $localstorage.setObject('cacheData_youtube', $scope.allData);
        console.log(JSON.stringify($scope.allData, null, 4));
    } else {
        $scope.allData = $localstorage.getObject('cacheData_youtube');
        $scope.DataAPI = utility.partition($localstorage.getObject('cacheData_youtube'), 3);
    }
})

.controller('ContactedServicesDetailCtrl', function($scope, $state) {

})
