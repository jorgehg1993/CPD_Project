angular.module('ionizer.servicerotten', ['ionizer.services'])

// This Factory provides API Calls
.factory('searchService', ['$http', '$q', 'APIFunctions', 'utility', function($http, $q, APIFunctions, utility) {
    var services = [
        {
            id: "1",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "2",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "3",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "4",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "5",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "6",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "7",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        },
        {
            id: "8",
            title: 'Search for service',
            request: 'I need a helper',
            offer: 'I offer my services',
            description: 'Detailed description',
            post_date: '29/05/2015',
            location: 'Queretaro, Queretaro, Mexico'
        }
    ];
    return {
        getServicesbySearch: function(){
            return services;
        }
    }
}])