/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';

    angular.module('frontend.topology')
        .controller('TopologyController', [
            '$scope', '$log', '$state', 'RoutesService', 'ServiceService', 'UpstreamsService',
            function controller($scope, $log, $state, $RoutesService, $ServiceService, $UpstreamsService) {
                let topologyData = [];
                $RoutesService.all().then((resp) => {
                    let routes = resp.data.data;
                    for (let route of routes) {
                        let routeItem = {
                            name: route.name,
                            children: []
                        };
                        let serviceId = route.service.id;
                        $ServiceService.findById(serviceId).then((resp) => {
                            let service = resp.data;
                            let upstreamName = service.host;
                            let serviceItem = {
                                name: service.name,
                                children: []
                            };
                            routeItem.children.push(serviceItem);
                            $UpstreamsService.findByName(upstreamName).then((resp) => {
                                let upstream = resp.data;
                                let upstreamItem = {
                                    name: upstream.name,
                                    children: []
                                };
                                serviceItem.children.push(upstreamItem);
                                $UpstreamsService.findTargetsById(upstream.id).then((resp) => {
                                    let targets = resp.data.data;
                                    for (let target of targets) {
                                        let targetItem = {
                                            name: target.target,
                                            children: []
                                        };
                                        upstreamItem.children.push(targetItem);
                                    }
                                }).catch((e) => {

                                });
                            }).catch((e) => {
                            });
                        }).catch((e) => {
                        });
                        topologyData.push(routeItem);
                    }
                }).catch((e) => {
                });
            }
        ])
    ;
}());
