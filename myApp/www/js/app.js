angular.module('ionizer', ['ionic', 'ngOpenFB', 'ngCordova', 'ionizer.controllers', 'ionizer.services', 'ionizer.searchswapscontroller', 'ionizer.myswapscontroller', 'ionizer.latestswapscontroller', 'ionizer.featuresdemocontroller'])

.run(function($ionicPlatform, ngFB, $window) {
    $ionicPlatform.ready(function() {
        ngFB.init({
            appId: '413104378894077',
            tokenStore: $window.localStorage
        });
        //localStorage.clear();
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        new RegExp('^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube|soundcloud|mixcloud)\.com(/.*)?$'),
        'self'
    ]);


    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/rotten/home');
    //$urlRouterProvider.otherwise("/");
    $urlRouterProvider.otherwise('/app/latestServices/home');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // This is the Main State, Parent of all the other States
        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/main.html",
        controller: 'AppCtrl'
    })

    .state('app.latestServices', {
        url: '/latestServices',
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/latest_swaps/latest-main.html'
            }
        }
    })

    // This state is for the Youtube  example, using Tabs
    .state('app.latestServices.home', {
        url: '/home',
        views: {
            'latest': {
                templateUrl: 'templates/latest_swaps/latest-home.html',
                controller: 'LatestSwapsCtrl'
            }
        }
    })

    // state for the detail page of Home Page using an reusable Controller & Template
    .state('app.latestServices.home-detail', {
        url: '/home-detail/:id',
        views: {
            'latest': {
                templateUrl: 'templates/latest_swaps/latest-detail.html',
                controller: 'LatestSwapsDetailCtrl'
            }
        }
    })

    // state for the detail page of Home Page using an reusable Controller & Template
    .state('app.latestServices.home-contact', {
        url: '/home-contact/:receiverId',
        views: {
            'latest': {
                templateUrl: 'templates/latest_swaps/latest-contact.html',
                controller: 'LatestSwapsContactsCtrl'
            }
        }
    })

    // This state is for the Rotten Tomatoes API example, using Tabs
    .state('app.searchServices', {
        url: '/searchServices',
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/search_swaps/search-main.html'
            }
        }
    })


    // state for the Home Page
    .state('app.searchServices.home', {
        url: '/home',
        views: {
            'search': {
                templateUrl: 'templates/search_swaps/search-home.html',
                controller: 'SearchSwapsHomeCtrl'
            }
        }
    })

    // state for the detail page of Home Page using an reusable Controller & Template
    .state('app.searchServices.home-detail', {
        url: '/home-detail/:id',
        views: {
            'search': {
                templateUrl: 'templates/search_swaps/search-detail.html',
                controller: 'SearchSwapsDetailCtrl'
            }
        }
    })

    // This state is for the Food2Fork API example, using Tabs
    .state('app.myServices', {
        url: '/myServices',
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/my_swaps/myswaps-main.html'
            }
        }
    })

    // Each tab has its own nav history stack:

    // state for the Home Page
    .state('app.myServices.home', {
        url: '/home',
        views: {
            'myServices': {
                templateUrl: 'templates/my_swaps/myswaps-home.html',
                controller: 'MySwapsCtrl'
            }
        }
    })

    // state for the detail page of Home Page using an reusable Controller & Template
    .state('app.myServices.home-detail', {
        url: '/home-detail/:id',
        views: {
            'myServices': {
                templateUrl: 'templates/my_swaps/myswaps-detail.html',
                controller: 'MySwapsDetailCtrl'
            }
        }
    })

    .state('app.myServices.home-edit', {
        url: '/home-edit/:id',
        views: {
            'myServices': {
                templateUrl: 'templates/my_swaps/myswaps-edit.html',
                controller: 'MySwapsEditCtrl'
            }
        }
    })

    .state('app.myServices.home-create', {
        url: '/home-create',
        views: {
            'myServices': {
                templateUrl: 'templates/my_swaps/myswaps-create.html',
                controller: 'MySwapsCreateCtrl'
            }
        }
    })

    .state('app.contactedServices', {
        url: '/contactedServices',
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: 'templates/contactedServices.html'
            }
        }
    })

    // Each tab has its own nav history stack:

    // state for the Home Page
    .state('app.contactedServices.home', {
        url: '/home',
        views: {
            'contactedServices': {
                templateUrl: 'templates/contactedServices-home.html',
                controller: 'ContactedServicesCtrl'
            }
        }
    })

    // state for the detail page of Home Page using an reusable Controller & Template
    .state('app.contactedServices.home-detail', {
        url: '/home-detail/:dataID',
        views: {
            'contactedServices': {
                templateUrl: 'templates/contactedServices-detail.html',
                controller: 'ContactedServicesDetailCtrl'
            }
        }
    })



    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'templates/about.html'
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.forgot', {
        url: '/forgot',
        views: {
            'menuContent': {
                templateUrl: 'templates/forgot.html'
            }
        }
    })

    .state('app.profile', {
        url: '/myProfile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.profile-edit', {
        url: '/profile/edit',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile-edit.html',
                controller: 'EditProfileCtrl'
            }
        }
    })

    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            }
        }
    })

})

.constant('SERVER', {
  // if using local server
  //url: 'http://localhost:3000'

  // if using external server
  url: 'http://sacredcowgaming.com:3001'
})

.constant('GEOLOCATION', {
  key: 'AIzaSyCEk0yJPLskR6paErBGM05I3BCVUd6O30A'
});

/*
.run(['$state', '$rootScope', function($state, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
    });
    // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
    //   // runs on individual scopes, so putting it in "run" doesn't work.
    //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
    // });
    $rootScope.$on('$viewContentLoaded', function(event) {
        console.log('$viewContentLoaded - fired after dom rendered', event);
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
    });
}])*/
