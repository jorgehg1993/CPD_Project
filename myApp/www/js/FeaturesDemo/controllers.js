angular.module('ionizer.featuresdemocontroller', ['ionizer.services', 'ngCordova'])


.controller('SettingsCtrl', function($scope, $localstorage){

    $scope.distance = {
        units: 'km'
    };

    if (typeof $localstorage.get('DistanceUnits') === "undefined") {
        $localstorage.set('DistanceUnits', 'km');
    };
    
    $scope.distance.units = $localstorage.get('DistanceUnits');
    console.log($scope.distance.units);

    $scope.saveUnit = function(){
        console.log('Saving choice: ' + $scope.distance.units);
        $localstorage.set('DistanceUnits', $scope.distance.units);
    }
})

.controller('featuresngCordovaCtrl', function($scope, $ionicPopup, $cordovaSplashscreen, $cordovaAdMob, $cordovaAppAvailability, $cordovaAppRate, $cordovaBarcodeScanner) {

    $scope.noPlugin = function(retmessage) {
        var alertPopup = $ionicPopup.alert({
            title: 'Can\'t open ' + retmessage + ' Plugin!',
            template: 'Have you installed the Plugin or is this a Web Browser? Check the Docs for more Information!'
        });
        alertPopup.then(function(res) {
            console.log('Please Install the Plugin and try in a Device');
        });
    }

    $scope.sendNotif = function(retmessage) {
        var alertPopup = $ionicPopup.alert({
            title: 'Notice',
            template: retmessage
        });
        alertPopup.then(function(res) {
            console.log('Popup Finished');
        });
    };

    $scope.showSplash = function() {
        if (navigator.splashscreen) {
            $cordovaSplashscreen.show();
            setTimeout(function() {
                $cordovaSplashscreen.hide()
            }, 2500)
        } else {
            $scope.noPlugin('Splash');
        }
    };

    $scope.checkTwitter = function() {
        if (typeof appAvailability !== 'undefined') {
            var checkApp = device.platform == "Android" ? "com.twitter.android" : "twitter://";
            $cordovaAppAvailability
                .check(checkApp)
                .then(function() {
                        $scope.sendNotif('Twitter is Installed');
                    },
                    function() {
                        $scope.sendNotif('Twitter is NOT Installed');
                    });
        } else {
            $scope.noPlugin('appAvailability');
        }
    };

    $scope.checkFacebook = function() {
        if (typeof appAvailability !== 'undefined') {
            var checkApp = device.platform == "Android" ? "com.facebook.katana" : "fb://";
            $cordovaAppAvailability
                .check(checkApp)
                .then(function() {
                        $scope.sendNotif('Facebook is Installed');
                    },
                    function() {
                        $scope.sendNotif('Facebook is NOT Installed');
                    });
        } else {
            $scope.noPlugin('appAvailability');
        }
    };

    $scope.checkWhatsapp = function() {
        if (typeof appAvailability !== 'undefined') {
            var checkApp = device.platform == "Android" ? "com.whatsapp" : "whatsapp://";
            $cordovaAppAvailability
                .check(checkApp)
                .then(function() {
                        $scope.sendNotif('Whatsapp is Installed');
                    },
                    function() {
                        $scope.sendNotif('Whatsapp is NOT Installed');
                    });
        } else {
            $scope.noPlugin('appAvailability');
        }
    };

    $scope.showRate = function() {
        if (typeof AppRate !== 'undefined') {
            $cordovaAppRate.promptForRating(true).then(function(result) {
                console.log(result);
            });
        } else {
            $scope.noPlugin('AppRate');
        }
    };

    $scope.showBarcode = function() {
        if (typeof cordova !== 'undefined') {
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Barcode Return',
                        template: "Result: " + barcodeData.text + "\n" +
                            "Format: " + barcodeData.format + "\n" +
                            "Cancelled: " + barcodeData.cancelled
                    });
                    alertPopup.then(function(res) {
                        console.log('Barcode Data returned');
                    });
                }, function(error) {
                    console.log(error)
                });
        } else {
            $scope.noPlugin('cordova.plugins.barcodeScanner');
        }
    };

})

.controller('featuresJSCtrl', function($scope, $ionicActionSheet, $ionicBackdrop, $timeout, $ionicPopup, $ionicLoading, $ionicModal, $ionicPopover) {

    $scope.$broadcast('scroll.refreshComplete');

    // Triggered on a button click, or some other target
    $scope.actionsheet = function() {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '<b>First</b> Option'
            }, {
                text: 'Second Option'
            }],
            destructiveText: 'Delete',
            titleText: 'Action Sheet',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function() {
            hideSheet();
        }, 2000);

    };

    $scope.doRefresh = function() {
        $timeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1300);
    };

    $scope.onEvent = function(retmessage) {
        var alertPopup = $ionicPopup.alert({
            title: 'An Event Just Registered!',
            template: retmessage
        });
        alertPopup.then(function(res) {
            console.log('Popup Finished');
        });
    };

    $scope.showLoading = function() {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $timeout(function() {
            $ionicLoading.hide();
        }, 1300);
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };


    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    // Triggered on a button click, or some other target
    $scope.showPopup = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="password" ng-model="data.wifi">',
            title: 'Enter Wi-Fi Password',
            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.wifi) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.wifi;
                    }
                }
            }, ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
    };
    // A confirm dialog
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Consume Ice Cream',
            template: 'Are you sure you want to eat this ice cream?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };

    // An alert dialog
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
})


