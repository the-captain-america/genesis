'use strict';
/*global ctrls angular chroma document $ _ async*/
ctrls.controller('HomeController', ['$scope', '$rootScope', '$location', 'WorkflowLevel1', 'WorkflowLevel1Charts', '$mdDialog', '$http','serverurl','CSRCustThemeService','$cookies','$sanitize','User','CustLabels',
    function($scope, $rootScope, $location, WorkflowLevel1, WorkflowLevel1Charts, $mdDialog, $http,serverurl,CSRCustThemeService, $cookies,$sanitize, User, CustLabels) {

        // Injector for modal
        previewOnlyModalDialogController.$inject = ['$scope', '$mdDialog'];
        filterModalDialogController.$inject = ['$scope', '$mdDialog', 'params'];

        // To set page class
        $rootScope.bodylayout = 'dashboard-page';

        //Chart 1: Top Left Pie Chart


        $scope.custfieldmaxcount = 0;

        $scope.getWorkflowList = function(callback) {
            var wflist = WorkflowLevel1Charts.save({
                chart: 'wflist'
            }, {},function() {
                var startColor = '#e92c92';
                var endColor = '#4e1cb5';

                var wfColorMap = {};
                var counter = 0;
                var wfphMap = {};
                $scope.custfieldmaxcount = wflist.custfieldmaxcount;
                for (var wfcounterkey in wflist.wflist) {
                    // wfColorMap[key] = colorArr[counter];
                    counter++;
                    wfphMap[wfcounterkey] = wflist.wflist[wfcounterkey].stph;
                }
                var colorArr;
                if (counter == 1) {
                    colorArr = [startColor];
                } else {
                    colorArr = chroma.scale([startColor, endColor]).colors(parseInt(counter));
                }

                counter = 0;
                for (var wfkey in wflist.wflist) {
                    wfColorMap[wfkey] = colorArr[counter];
                    counter++;
                }

                // console.info('wfphMap   is '+JSON.stringify(wfphMap));
                $scope.wfphMap = wfphMap;
                $scope.wfColorMap = wfColorMap;
                $scope.wflist = wflist;

                if(callback) {
                    return callback(null, 'OK');
                }
            });
        };

        $scope.getDashboardFilter = function(callback) {

            //make sure that show $scope.showSigninAs is set to fasle for CSR
            $scope.showSigninAs = CSRCustThemeService.getShowSigninAs();
            if(!$scope.showSigninAs) {
                if ($cookies.get('a_u') && $cookies.get('s_u')) {
                    $scope.showSigninAs = true;
                }
            }

            if($rootScope.userpref && $rootScope.userpref.dash) {
                $scope.dashfilter =  $rootScope.userpref.dash;

                //If no preferred filter, then set none as default filter
                if(!$scope.dashfilter.selfilterid) {
                    $scope.dashfilter.selfilterid = 'none';
                } else if ($scope.dashfilter.selfilterid !== 'none') {
                    //if selected filter is not present in filter list, set none as selected
                    var filterIndex = _.findIndex($scope.dashfilter.filters, {filterid : $scope.dashfilter.selfilterid});
                    if(filterIndex === -1) {
                        $scope.dashfilter.selfilterid = 'none';
                    }
                }
                if(callback) {
                    return callback(null, 'OK');
                }

            } else {
                $http.get(serverurl + 'user/get/dash/pref', {
                }).then(function onSuccess(response) {
                    var data = response.data;
                    $rootScope.userpref = {};
                    $rootScope.userpref.dash = data.dashpref;
                    $scope.dashfilter =  data.dashpref;

                    if(!$scope.dashfilter) {
                        $scope.dashfilter = {};
                    }
                    if(!$scope.dashfilter.filters) {
                        $scope.dashfilter.filters = [];
                    }

                    //If no preferred filter, then set none as default filter
                    if(!$scope.dashfilter.selfilterid) {
                        $scope.dashfilter.selfilterid = 'none';
                    } else if ($scope.dashfilter.selfilterid !== 'none') {
                        //if selected filter is not present in filter list, set none as selected
                        var filterIndex = _.findIndex($scope.dashfilter.filters, {filterid : $scope.dashfilter.selfilterid});
                        if(filterIndex === -1) {
                            $scope.dashfilter.selfilterid = 'none';
                        }
                    }
                    if(callback) {
                        return callback(null, 'OK');
                    }
                }, function onError(error) {
                });
            }
        };


        $scope.getChart1Data = function()
        {
            var filter = {};
            if($scope.dashfilter) {
                filter.filterid = $scope.dashfilter.selfilterid || 'none';
                filter.filters = $scope.dashfilter.filters;
                filter.custfieldmaxcount = $scope.custfieldmaxcount;
            }
            let debugdf = $location.search().debugdf;
            var chart1data = WorkflowLevel1Charts.save({
                chart: 'chart1'
            }, {wfphMap : $scope.wfphMap, filter : filter, debugdf: debugdf},function() {
                $scope.configureChart1PieData($scope.wflist.wflist, chart1data.piechart, $scope.wfColorMap);
            });
        };

        $scope.getChart2Data = function()
        {
            $scope.chart2Total = 0;
            var filter = {};
            if($scope.dashfilter) {
                filter.filterid = $scope.dashfilter.selfilterid || 'none';
                filter.filters = $scope.dashfilter.filters;
                filter.custfieldmaxcount = $scope.custfieldmaxcount;
            }
            var chart2data = WorkflowLevel1Charts.save({
                chart: 'chart2'
            }, {filter : filter},function() {
                $scope.configureChart2BarData($scope.wflist.wflist, chart2data, $scope.wfColorMap);
            });
        };

        $scope.getChart3Data = function()
        {
            var filter = {};
            if($scope.dashfilter) {
                filter.filterid = $scope.dashfilter.selfilterid || 'none';
                filter.filters = $scope.dashfilter.filters;
                filter.custfieldmaxcount = $scope.custfieldmaxcount;
            }
            let debugdf = $location.search().debugdf;
            var chart3data = WorkflowLevel1Charts.save({
                chart: 'chart3'
            }, {filter : filter,  debugdf: debugdf},function() {
                $scope.alerts = chart3data.alerts;
            });
            $scope.custlabels = CustLabels.getCustomLabels();
        };

        $scope.getChart4Data = function()
        {
            var filter = {};
            if($scope.dashfilter) {
                filter.filterid = $scope.dashfilter.selfilterid || 'none';
                filter.filters = $scope.dashfilter.filters;
                filter.custfieldmaxcount = $scope.custfieldmaxcount;
            }
            var chart4data = WorkflowLevel1Charts.save({
                chart: 'chart4'
            }, {filter : filter},function() {
                $scope.leaders = chart4data.leaders;
            });
        };

        async.parallel(
            [
                async.apply($scope.getDashboardFilter),
                async.apply($scope.getWorkflowList)
            ],
            function(err, results) {
                //Chart 1: Top Left Pie Chart
                $scope.getChart1Data();
                //Chart 2: Top Right Month wise Bar Chart
                $scope.getChart2Data();
                //Chart 3: Bottom left
                $scope.getChart3Data();
                //Chart 4: Bottom right
                $scope.getChart4Data();
            });


        // Go to Level 2 dashboard from Chart 1 Data
        $scope.level2Dashboard = function(ev, wfname, wfid, count, phase,stph) {

            if (count) {
                if(stph) {
                    $location.path('/dashboard-level2/wf/' + wfid + '/' + phase).search('wfname', wfname).search('stph', stph).search('filter',$scope.dashfilter.selfilterid).search('cfmaxcnt', $scope.custfieldmaxcount);
                } else {
                    $location.path('/dashboard-level2/wf/' + wfid + '/' + phase).search('wfname', wfname).search('filter',$scope.dashfilter.selfilterid).search('cfmaxcnt', $scope.custfieldmaxcount);
                }
            }
        };

        $scope.gotoErrorReport = function() {
            $location.path('/reports/error');
        };
        $scope.gotoAlertsLevel2 = function(alertsFor) {
            $location.path('/alerts-level2/'+alertsFor).search('filter',$scope.dashfilter.selfilterid);
        };

        $scope.configureChart1PieData = function(wfidnames, level1data, colorMap) {

            var l1LocalData = [];

            $scope.preTotal = 0;
            $scope.startTotal = 0;
            $scope.postTotal = 0;
            $scope.chartTotal = 0;

            // console.info('wfidnames '+JSON.stringify(wfidnames));
            for (var wfkey in wfidnames) {
                var rowData = {};
                rowData.wfname = wfidnames[wfkey].name;
                rowData.wfid = wfkey;
                rowData.ord = wfidnames[wfkey].ord;
                rowData.act = wfidnames[wfkey].act;
                rowData.stph = wfidnames[wfkey].stph;
                rowData.pre = 0;
                rowData.start = 0;
                rowData.post = 0;
                rowData.color = colorMap[wfkey];
                for (var i = 0; i < level1data.length; i++) {
                    // console.info('wfkey  %s  and level1data[i].wfid %s', wfkey,level1data[i].wfid);
                    if (wfkey === level1data[i].wfid) {
                        if (level1data[i].pre) {
                            rowData.pre = level1data[i].pre;
                            $scope.preTotal = $scope.preTotal + parseInt(level1data[i].pre);
                        }
                        if (level1data[i].start) {
                            rowData.start = level1data[i].start;
                            $scope.startTotal = $scope.startTotal + parseInt(level1data[i].start);
                        }
                        if (level1data[i].post) {
                            rowData.post = level1data[i].post;
                            $scope.postTotal = $scope.postTotal + parseInt(level1data[i].post);
                        }
                        break;
                    }
                }
                l1LocalData.push(rowData);
            }

            $scope.l1data = [];
            l1LocalData.forEach(function(row){
                if(row.act === 'N') {
                    if(row.pre === 0 && row.start === 0 && row.post === 0) {
                        return;
                    }
                }
                $scope.l1data.push(row);

            });
            $scope.chartTotal = $scope.preTotal + $scope.startTotal + $scope.postTotal;
        };

        $scope.configureChart2BarData = function(wfidnames, chart2Data, wfColormap) {
            // console.info('colorRemArr  '+JSON.stringify(colorRemArr));
            $('.spinner-overlay').addClass('show');

            $scope.sfdata = chart2Data.sfdata;
            if (!chart2Data.monthsdata || chart2Data.monthsdata.length === 0 || (chart2Data.monthsdata.length > 0 && chart2Data.monthsdata[0].y.length === 0)) {
                $scope.showChart2 = false;
                setTimeout(function() {
                    $('.spinner-overlay').removeClass('show');
                }, 100);
                return;
            }
            $scope.showChart2 = true;

            $scope.chart2BarObject = {
                type: 'ColumnChart',
                displayed: false,
                data: {
                    cols: [{
                        id: 'month',
                        label: 'Month',
                        type: 'string'
                    }],
                    rows: []
                },
                options: {
                    isStacked: true,
                    colors: [],
                    legend: {
                        position: 'none'
                    },
                    // colors: ['#6a25f8', '#03a9f4', '#00d4ff', '#ff4bff', '#810b6c', '#ad028f', '#8100ee', '#6e09b7', '#ff005b'],
                    // fill: 20,
                    displayExactValues: false,
                    animation: {
                        duration: 500,
                        easing: 'inAndOut',
                        startup: true
                    },
                    chartArea: {
                        left: 25,
                        width: '100%'
                    },
                    vAxis: {
                        // format : {format: 'none'},
                        gridlines: {
                            count: 4
                        }
                    },
                    hAxis: {
                        slantedTextAngle: 45,
                        slantedText: true
                        // textPosition: 'none'
                    }
                },
                formatters: {}

            };

            var delCounter = 0;
            var deletedMap = {};
            for (var i = 0; i < chart2Data.monthsdata[0].y.length; i++) {
                var color,wfname,wfid;
                if (wfidnames[chart2Data.monthsdata[0].y[i].id]) {
                    wfname = wfidnames[chart2Data.monthsdata[0].y[i].id].name;
                    color = wfColormap[chart2Data.monthsdata[0].y[i].id];
                    wfid = chart2Data.monthsdata[0].y[i].id;
                } else {
                    // wfname = chart2Data.monthsdata[0].y[i].n +' (D)';
                    wfname = 'Deleted Workflows';
                    color = '#3337cf';
                    wfid = '__del_wf_id__';
                    //Holder for Deleted Records
                    deletedMap[chart2Data.monthsdata[0].y[i].id] = 'yes';
                    if (delCounter > 0) {
                        continue;
                    }
                    delCounter++;
                }

                $scope.chart2BarObject.options.colors.push(color);

                $scope.chart2BarObject.data.cols.push({
                    id: wfid,
                    label: wfname,
                    type: 'number'
                });
            }
            var chart2Tot = 0;
            for ( i = 0; i < chart2Data.monthsdata.length; i++) {
                var rowcol = [];
                rowcol.push({
                    v: chart2Data.monthsdata[i].ym
                });
                for (var j = 1; j < $scope.chart2BarObject.data.cols.length; j++) {
                    var found = 'no';
                    var delCount = 0;
                    for (var k = 0; k < chart2Data.monthsdata[i].y.length; k++) {
                        if ($scope.chart2BarObject.data.cols[j].id === chart2Data.monthsdata[i].y[k].id) {
                            rowcol.push({
                                v: chart2Data.monthsdata[i].y[k].c
                            });
                            chart2Tot = chart2Tot+chart2Data.monthsdata[i].y[k].c;
                            found = 'yes';
                            break;
                        } else if ($scope.chart2BarObject.data.cols[j].id === '__del_wf_id__') {
                            if (deletedMap[chart2Data.monthsdata[i].y[k].id]) {
                                delCount = delCount + chart2Data.monthsdata[i].y[k].c;
                                //rowcol.push({v:chart2Data.monthsdata[i].y[k].c});
                                found = 'delyes';
                            }
                        }
                    }
                    if (found === 'no') {
                        rowcol.push({
                            v: 0
                        });
                    } else if (found === 'delyes') {
                        rowcol.push({
                            v: delCount
                        });
                        chart2Tot = chart2Tot+delCount;
                    }
                }
                $scope.chart2BarObject.data.rows.push({
                    c: rowcol
                });

            }
            $scope.chart2Total = chart2Tot;
            setTimeout(function() {
                $('.spinner-overlay').removeClass('show');
            }, 100);
        };

        // Notifications table modal(s)
        $scope.previewOnlyModal = function(ev) {
            $mdDialog.show({
                controller: previewOnlyModalDialogController,
                templateUrl: 'views/dashboard/modal-preview-only.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            });
        };

        function previewOnlyModalDialogController($scope, $mdDialog) {
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            // Set overlay class in modal
            $scope.overlayclass = 'open';
            $scope.actionclass = 'not-actioned';

            $scope.actionNotification = function() {
                if ($scope.overlayclass === 'open') {
                    $scope.overlayclass = 'closed';
                    $scope.actionclass = 'actioned';
                }
            };

            // Spinner for preview
            setTimeout(function() {
                $('.preview-spinner').addClass('show');
            }, 0);
            setTimeout(function() {
                $('.preview-spinner').removeClass('show');
            }, 3000);
        }


        $scope.applyFilter = function() {
            if($scope.dashfilter.selfilterid === 'new') {
                //reset to none
                $scope.dashfilter.selfilterid = 'none';
                $scope.filterModal('new');
                return;
            }
            $rootScope.userpref.dash.selfilterid = $scope.dashfilter.selfilterid ;
            $scope.getDashboardFilter();

            $http.post(serverurl + 'user/upd/dash/pref', {
                op : 'selfilter', filterid : $scope.dashfilter.selfilterid
            }).then(function onSuccess(response) {
                var data  = response.data;
                if(data.status === 'error') {
                    $scope.perfError = 'yes';
                    $scope.perfErrorMessage = data.message;
                    return;
                }
            }, function onError(error) {
            });

            $scope.getChart1Data();
            $scope.getChart2Data();
            $scope.getChart3Data();
            $scope.getChart4Data();


        };

        $scope.fetchFilterData = function(callback)
        {
            $http.get(serverurl + 'dash1/filter/setup', {
            }).then(function onSuccess(response) {
                return callback(null, response.data);
            }, function onError(error) {
            });
        };

        $scope.filterModal = function(mode) {
            $scope.fetchFilterData(
                function(err, response) {
                    $mdDialog.show({
                        controller: filterModalDialogController,
                        templateUrl: 'views/dashboard/modal-filters.html',
                        parent: angular.element(document.body),
                        locals : {
                            params : {category : response.category, cflist: response.cflist, dashfilters : $scope.dashfilter.filters, mode : mode, users : response.users || []}
                        },
                        clickOutsideToClose: false
                    }).then(function(answer) {
                        //Root scope must be set, so we should just update filters
                        $scope.getDashboardFilter();
                        if(answer && answer.applyfilter) {
                            $scope.dashfilter.selfilterid = answer.applyfilter.filterid;
                            $scope.applyFilter();
                        }


                    }, function() {
                        //Root scope must be set, so we should just update filters
                        $scope.getDashboardFilter();
                    });
                });
        };

        function filterModalDialogController($scope, $mdDialog, params) {

            $scope.mode = params.mode || 'list';
            $scope.category = params.category;
            $scope.cflist = params.cflist;
            $scope.dashfilters = params.dashfilters || [];
            $scope.valueChoices = [];

            $scope.userItem = {type :'user', dispnm : 'Users', key : 'user', val : []};
            params.users.forEach(function(userData){
                $scope.userItem.val.push({key: userData.userid, val : userData.name});
            });

            $scope.selectCategory = function(index, criteria, cat, change) {
                if(!cat) {
                    return;
                }
                if(change && $scope.filter.criteria[index] && $scope.filter.criteria[index].value) {
                    $scope.filter.criteria[index].value.length = 0;
                }
                $scope.valueChoices[index] = _.find($scope.category, {key: cat.key}).val;
                criteria.field = cat.key;
                criteria.typ = 'cat';
                criteria.dispnm = 'Category / ' + cat.dispnm;
            };

            $scope.selectUser = function(index, criteria, change) {
                if(change && $scope.filter.criteria[index] && $scope.filter.criteria[index].value) {
                    $scope.filter.criteria[index].value.length = 0;
                }
                $scope.valueChoices[index] = $scope.userItem.val;
                criteria.field = 'user';
                criteria.typ = 'usr';
                criteria.dispnm = 'User';
            };

            $scope.selectCustomField = function(index, criteria, cf, change) {
                if(!cf) {
                    return;
                }
                if(change && $scope.filter.criteria[index] && $scope.filter.criteria[index].value) {
                    $scope.filter.criteria[index].value.length = 0;
                }
                $scope.valueChoices[index] = _.find($scope.cflist, {uid: cf.uid}).vals;
                criteria.field = cf.uid;
                criteria.typ = 'cf';
                criteria.dispnm = 'Custom Field / ' + cf.nm;
            };

            $scope.deleteCriteria = function(index) {
                $scope.valueChoices.splice(index,1);
                $scope.filter.criteria.splice(index,1);
            };

            $scope.addCriteria = function() {
                $scope.filter.criteria.push({op:'eq'});
                $scope.valueChoices.push([]);
            };

            $scope.displayOrValues = function(critValArr, index)
            {
                if(!critValArr) {
                    return 'Select';
                }

                if(critValArr.length === 0) {
                    return 'Select';
                }
                var returnStr = '';

                critValArr.forEach(function(critval){
                    for(var i =0; i < $scope.valueChoices[index].length; i++ ) {
                        if($scope.valueChoices[index][i].key === critval) {
                            returnStr += ' <span class="orval">or</span> '+ $scope.valueChoices[index][i].val;
                        } else {
                            continue;
                        }
                    }
                });
                returnStr =  returnStr.substring(' <span class="orval">or</span> '.length);
                return $sanitize(returnStr);
                // return returnStr;
            };

            $scope.showUpdateFilter = function (filter) {
                console.log('**onload filter  ::: ' + JSON.stringify(filter));
                $scope.mode = 'upd';
                $scope.filter = angular.copy(filter);

                if ($scope.filter.criteria) {
                    var index = 0;
                    $scope.filter.criteria.forEach(function (crit) {
                        $scope.valueChoices.push([]);
                        if (crit.typ) {
                            switch (crit.typ) {
                            case 'cat':
                                $scope.selectCategory(index, crit, _.find($scope.category, { key: crit.field }));
                                break;
                            case 'cf':
                                $scope.selectCustomField(index, crit, _.find($scope.cflist, { uid: crit.field }));
                                break;
                            case 'usr':
                                $scope.selectUser(index, crit);
                                break;
                            }
                            // Accomodate values in database when typ attribute was not used
                        } else if (crit.field === 'user') {
                            $scope.selectUser(index, crit);
                        } else {
                            $scope.selectCategory(index, crit, _.find($scope.category, { key: crit.field }));
                        }
                        index++;
                    });
                }
            };

            $scope.showApplyNoneFilter = function()
            {
                $mdDialog.hide({applyfilter : {filterid : 'none'}});
            };

            $scope.showApplyFilter = function(filter) {
                console.log('Apply Filter  ::: '+JSON.stringify(filter));
                $mdDialog.hide({applyfilter : filter});
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.newfilter = function() {
                $scope.filter = {};
                $scope.filter.criteria = [];
                $scope.filter.criteria.push({op:'eq'});
                $scope.valueChoices.push([]);
                $scope.mode = 'new';
            };

            if($scope.mode === 'new') {
                $scope.newfilter();
            }

            $scope.back = function() {
                $scope.filter = {};
                $scope.mode = 'list';
            };

            $scope.deleteFilter = function(filterid) {
                $http.post(serverurl + 'user/upd/dash/pref', {
                    op : 'del', filterid : filterid
                }).then(function onSuccess(response) {
                    var data = response.data;
                    if(data.status === 'error') {
                        $scope.perfError = 'yes';
                        $scope.perfErrorMessage = data.message;
                        return;
                    }
                    $rootScope.userpref.dash = data.dashpref;
                    $scope.dashfilters = data.dashpref.filters;
                }, function onError(error) {
                });
            };

            $scope.save = function() {
                console.log('Filter is ::: '+JSON.stringify($scope.filter));

                // Remove dispnm used for display before save
                $scope.filter.criteria.forEach(function(crit){
                    delete crit.dispnm;
                });

                if($scope.mode === 'new') {
                    $scope.dashfilters.push($scope.filter);
                    $http.post(serverurl + 'user/upd/dash/pref', {
                        op : 'add', filteritem : $scope.filter
                    }).then(function onSuccess(response) {
                        var data  = response.data;
                        if(data.status === 'error') {
                            $scope.perfError = 'yes';
                            $scope.perfErrorMessage = data.message;
                            return;
                        }
                        $rootScope.userpref.dash = data.dashpref;
                        $scope.dashfilters = data.dashpref.filters;

                        $scope.mode = 'list';
                    }, function onError(error) {
                    });
                } else {
                    $http.post(serverurl + 'user/upd/dash/pref', {
                        op : 'upd', filteritem : $scope.filter, filterid : $scope.filter.filterid
                    }).then(function onSuccess(response) {
                        var data = response.data;
                        if(data.status === 'error') {
                            $scope.perfError = 'yes';
                            $scope.perfErrorMessage = data.message;
                            return;
                        }
                        $rootScope.userpref.dash = data.dashpref;
                        $scope.dashfilters = data.dashpref.filters;

                        $scope.mode = 'list';

                    }, function onError(error) {
                    });
                }

            };

        }
    }
]);
