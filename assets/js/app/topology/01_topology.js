/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
    'use strict';

    angular.module('frontend.topology')
        .controller('TopologyController', [
            '$scope', '$log', '$state','RoutesService',
            function controller($scope, $log, $state,$RoutesService) {
                let data = [];
                $RoutesService.all().then((resp)=>{
                    let routes = resp.data.data;
                    for(let route of routes) {

                    }
                }).catch((e)=>{

                });
            }
        ])
    ;
}());
