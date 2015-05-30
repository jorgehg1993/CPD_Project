angular.module('ionizer.servicefood2fork', ['ionizer.services'])

// This Factory provides API Calls
.factory('food2forkService', ['$http', '$q', 'APIFunctions', 'utility', function($http, $q, APIFunctions, utility) {

    var _query = '';
    var _detailID = '';
    var _URL = '';
    var _page = 1;
    var _params = '';

    var getPropByString = utility.getPropByString;

    var APICallsettings = {};

    var settings = {};

    settings.APIKey = '85477304d6908074485ae5db6665ed2b';


    settings.method = 'GET'

    // Name of the search and detail Property
    settings.searchProperty = 'q';
    settings.detailProperty = '';


    // Home Properties
    settings.homeSettings = {
        URL: {
            baseURL: function() {
                return 'http://food2fork.com/api/search';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                page: function() {
                    return _page
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'recipes',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'recipe_id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'title') 
            },
            API_Subtext: function(data) {
                return 'By: ' + getPropByString(data, 'publisher') 
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'image_url')
            },
            API_AddText: function(data) {
                return 'Social Rank: ' + getPropByString(data, 'social_rank')
            },
            API_DetailText: function(data) {
                return 'Site: ' + getPropByString(data, 'publisher_url')
            }
        }
    }

    // Detail Properties
    settings.detailSettings = {
        URL: {
            baseURL: function() {
                return 'http://food2fork.com/api/get';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                rId: function() {
                    return _detailID
                }
            }
        },
        Type: 'detail',
        API_DataProperty: 'recipe',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'recipe_id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'title') 
            },
            API_Subtext: function(data) {
                return 'By: ' + getPropByString(data, 'publisher') 
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'image_url')
            },
            API_AddText: function(data) {
                return 'Social Rank: ' + getPropByString(data, 'social_rank')
            },
            API_DetailText: function(data) {
                return 'Site: ' + getPropByString(data, 'publisher_url')
            }
        }
    }

    // Search Properties
    settings.searchSettings = {
        URL: {
            baseURL: function() {
                return 'http://food2fork.com/api/search';
            },
            params: {
                key: function() {
                    return settings.APIKey
                },
                page: function() {
                    return _page
                },
                q: function() {
                    return _query
                }
            }
        },
        Type: 'list',
        API_DataProperty: 'recipes',
        returnElements: {
            API_ID: function(data) {
                return getPropByString(data, 'recipe_id')
            },
            API_Title: function(data) {
                return getPropByString(data, 'title') 
            },
            API_Subtext: function(data) {
                return 'By: ' + getPropByString(data, 'publisher') 
            },
            API_IMGURL: function(data) {
                return getPropByString(data, 'image_url')
            },
            API_AddText: function(data) {
                return 'Social Rank: ' + getPropByString(data, 'social_rank')
            },
            API_DetailText: function(data) {
                return 'Site: ' + getPropByString(data, 'publisher_url')
            }
        }
    }

    return {
        // set query parameter
        setQuery: function(query) {
            _query = query;
        },
        // set detail parameter
        setID: function(detailID) {
            _detailID = detailID;
        },
        getID: function() {
            return _detailID;
        },
        setPage: function(page) {
            if (page == 0) {
                _page = 0
            } else if (!page || page.length == 0) {
                _page = _page + 1;
            } else {
                _page = page;
            }
        },
        getPage: function() {
            return _page;
        },
        callAPI: function(type) {
            switch (type) {
                case 'Home':
                    APICallsettings = settings.homeSettings;
                    break;
                case 'Search':
                    APICallsettings = settings.searchSettings;
                    break;
                case 'Detail':
                    APICallsettings = settings.detailSettings;
                    break;
                default:
                    return 'Not Available';
            }

            var returnURL = APIFunctions.makeURL(APICallsettings);


            var deferred = $q.defer();
            $http({
                    method: settings.method,
                    url: returnURL.URL,
                    params: returnURL.params
                })
                .success(function(data) {
                    deferred.resolve(APIFunctions.prepareData(data, APICallsettings));
                })
                .error(function() {
                    deferred.reject('There was an error');
                })
            return deferred.promise;
        }
    }
}])