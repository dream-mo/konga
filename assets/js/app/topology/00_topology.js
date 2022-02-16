
(function() {
    'use strict';

    angular.module('frontend.topology', []);

    // Module configuration
    angular.module('frontend.topology')
        .config([
            '$stateProvider',
            function config($stateProvider) {
                $stateProvider
                    .state('topology', {
                        parent: 'frontend',
                        url: '/topology',
                        data : {
                            activeNode : true,
                            pageName : "Route Topology",
                            access: 2, // Only admins can access this route
                            // displayName : "node info",
                            pageDescription : "About routing topology diagram",
                            prefix : '<i class="material-icons text-primary">&#xE88F;</i>'
                        },
                        views: {
                            'content@': {
                                templateUrl: 'js/app/topology/index.html',
                                controller: 'TopologyController'
                            }
                        },
                    })
                ;
            }
        ])
    ;
}());
