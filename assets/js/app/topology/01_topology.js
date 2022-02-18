/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
    'use strict';
    // 渲染
    function drawTree(document_id, data) {
        var myChart = echarts.init(document.getElementById(document_id));
        var option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            textStyle: {
                fontSize: 17,
                fontWeight: "bold"
            },
            series: [
                {
                    type: 'tree',
                    id: 0,
                    name: 'tree1',
                    data: [data],
                    top: '10%',
                    left: '10%',
                    bottom: '22%',
                    right: '20%',
                    symbolSize: 10,
                    edgeShape: 'polyline',
                    edgeForkPosition: '63%',
                    initialTreeDepth: 3,
                    lineStyle: {
                        width: 2
                    },
                    label: {
                        backgroundColor: '#fff',
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        };
        myChart.setOption(option);
    }

    // 格式化数组
    function formatArray(arr)
    {
        return arr ? `[ ${arr.join("、")} ]` : '[ ]'
    }

    angular.module('frontend.topology')
        .controller('TopologyController', [
            '$scope', '$log', '$state', 'RoutesService', 'ServiceService', 'UpstreamsService',
            function controller($scope, $log, $state, $RoutesService, $ServiceService, $UpstreamsService) {
                let total = 0;
                $RoutesService.all().then((resp) => {
                    let routes = resp.data.data;
                    let labelHealthy = {
                            backgroundColor: "#1ABB9C",
                            color: "white",
                            fontSize: 15,
                            width: 240,
                            height: 30,
                            align: "center"
                    };
                    for (let route of routes) {
                        let routeItem = {
                            name: route.name,
                            label: labelHealthy,
                            value: {
                              hosts: route.hosts,
                              headers: route.headers,
                              paths: route.paths,
                              methods: route.methods,
                              tags: route.tags
                            },
                            tooltip: {
                                formatter: function(arg) {
                                    let methods = formatArray(arg.value.methods);
                                    let hosts = formatArray(arg.value.hosts);
                                    let paths = formatArray(arg.value.paths);
                                    return `
                                    hosts: ${hosts} <br/>
                                    paths: ${paths}<br/>
                                    methods: ${methods}<br/>
                                    `;
                                }
                            },
                            children: []
                        };
                        let serviceId = route.service.id;
                        $ServiceService.findById(serviceId).then((resp) => {
                            let service = resp.data;
                            let upstreamName = service.host;
                            let serviceItem = {
                                name: service.name,
                                label: labelHealthy,
                                value: {
                                    protocol: service.protocol,
                                    path: service.path
                                },
                                tooltip: {
                                    formatter: function(arg) {
                                    let protocol = arg.value.protocol;
                                    let path = arg.value.path ? arg.value.path : '';
                                    return `
                                    protocol: ${protocol} <br/>
                                    path: ${path}<br/>
                                    `;
                                    }
                                },
                                children: []
                            };
                            routeItem.children.push(serviceItem);
                            $UpstreamsService.findByName(upstreamName).then((resp) => {
                                let upstream = resp.data;
                                let upstreamItem = {
                                    name:  upstream.name,
                                    label: labelHealthy,
                                    value: {
                                        algorithm: upstream.algorithm
                                    },
                                    tooltip: {
                                        formatter: function(arg) {
                                            let algorithm = arg.value.algorithm;
                                            return `
                                    algorithm: ${algorithm} <br/>
                                    `;
                                        }
                                    },
                                    children: []
                                };
                                serviceItem.children.push(upstreamItem);
                                $UpstreamsService.findTargetsById(upstream.id).then((resp) => {
                                    let targets = resp.data.data;
                                    let totalWeight = 0;
                                    for (let target of targets) {
                                        totalWeight += target.weight;
                                    }
                                    for (let target of targets) {
                                        let percent = target.weight/totalWeight;
                                        percent = percent.toFixed(2) * 100;
                                        let targetItem = {
                                            name: `${target.target}(${percent}%)`,
                                            label: {
                                                color: "#1ABB9C"
                                            },
                                            value: {
                                                weight: target.weight
                                            },
                                            tooltip: {
                                                formatter: function(arg) {
                                                    let weight = arg.value.weight;
                                                    return `
                                    weight: ${weight} <br/>
                                    `;
                                                }
                                            },
                                            children: []
                                        };
                                        upstreamItem.children.push(targetItem);
                                    }
                                    let root_container_dom = document.getElementById('topology_container');
                                    let div_container = document.createElement('div');
                                    div_container.id = "main_" + route.id;
                                    div_container.style = 'width: 110%;height:150px;';
                                    root_container_dom.appendChild(div_container);
                                    drawTree("main_" + route.id, routeItem);
                                    total += 1;
                                    $scope.total = total;
                                }).catch((e) => {

                                });
                            }).catch((e) => {
                            });
                        }).catch((e) => {
                        });
                    }
                }).catch((e) => {
                });
            }
        ])
    ;
}());
