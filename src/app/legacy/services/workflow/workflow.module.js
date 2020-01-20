import angular from 'angular';
import moment from 'moment';
import ngResource from 'angular-resource';

const emailregexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let workflowService = angular
    .module('workflowService', [ngResource])
    .factory('Workflow', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'wfdefn/d/:datatype/:uid',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])
    .factory('Preview', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'preview/d/:datatype/:uid',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])
    .factory('ChainSeqRemove', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'wfdefn/rmchain/wf/seq/:wfid',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])
    .factory('WorkflowInit', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'wfinit/d/:uid',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])
    .factory('WorkflowLevel1', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'wfinit/l1/:uid',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])
    .factory('WorkflowLevel1Charts', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'dash1/l1chart/:chart',
                {},
                {
                    update: {
                        method: 'PUT'
                    }
                }
            );
        }
    ])
    .factory('StatusTooltips', [
        '$resource',
        function($resource) {
            return {
                showStatusTooltips: function(state) {
                    if (state === 'pending') {
                        return 'All ready to go, participants are ready and awaiting the first sequence to trigger.';
                    } else if (state === 'incomplete') {
                        return 'Oops, this is finished and stopped progressing on the timeline, but not all containing actions or notifications are marked as complete.';
                    } else if (state === 'cancelled') {
                        return 'Stop, this is cancelled and no more actions or notifications will trigger.';
                    } else if (state === 'deleted') {
                        return 'Trashed and gone, this has been deleted and does not exist in our system anymore.';
                    } else if (state === 'error') {
                        return 'Whoops, something has gone wrong. It should be resolved so it doesent happen again.';
                    } else if (state === 'in progress') {
                        return 'It’s alive, participants are currently active with more actions or communications that are set to trigger.';
                    } else if (state === 'complete') {
                        return 'Good work, this is finished and stopped progressing on the timeline.';
                    } else if (state === 'overdue') {
                        return 'Oh-no, some tasks or notifications have been overlooked and should be taken care of promptly.';
                    } else if (state === 'skipped') {
                        return 'Not relevant, participants have already progressed past this point when the action or notification was due to trigger.';
                    } else if (state === 'dismissed') {
                        return 'Pay no mind, lets count this as complete, even though it isn’t.';
                    } else if (state === 'change') {
                        return 'Updated, details have been changed from the initial entry.';
                    } else if (state === 'launched') {
                        return 'Launched and ready, awaiting the first sequence to trigger.';
                    } else if (state === 'gdpr_signed') {
                        return "It's signed and ready, participant has agreed to your stated terms.";
                    } else if (
                        state === 'gdpr_notsigned' ||
                        state === 'gdpr_viewed'
                    ) {
                        return 'Participant has not agreed to the stated terms and can not view any content until the form has been signed.';
                    }
                }
            };
        }
    ])

    .factory('UserDirectory', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'userdir/l/:username',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])

    .factory('WFDefnService', [
        '$rootScope',
        'Category',
        '$sessionStorage',
        function($rootScope, Category, $sessionStorage) {
            var wfList = {};
            var renItem = {};
            var dupItem = {};
            var l3SidenavItem = {};
            var notifyLinkState;
            var sidenavPopupState;
            var widgetPopupState;
            var previewModid;

            var webhookData = {};
            var lockState;
            let lockedWf = 'no';
            return {
                getWfList: function() {
                    // console.info('Defn Service GET ::::: '+JSON.stringify(wfList));
                    return wfList;
                },
                setWfList: function(val) {
                    // console.info('Defn Service SET withj VAL ::::: '+JSON.stringify(val));
                    wfList = val;
                    // console.info('Defn Service SET ::::: '+JSON.stringify(wfList));
                    // console.info('Defn Service SET ::::: ');
                    $rootScope.$broadcast('event:wfList');
                },
                getLockedWf: function() {
                    return lockedWf;
                },
                setLockedWf: function(locked) {
                    lockedWf = locked;
                },
                getWebhookData: function() {
                    return webhookData;
                },
                setWebhookData: function(val) {
                    webhookData = val;
                    $rootScope.$broadcast('event:setwebhookdata');
                },
                validateEmailMobile: function(val) {
                    console.log('validateEmailMobile :::: ' + val);
                    var result = {};

                    if (val.indexOf('@') === -1) {
                        result.type = 'mobile';
                        if (val.charAt(0) !== '+') {
                            result.error = 'mobileError';
                            return result;
                        }
                        val = val.replace(/ /g, '');
                        val = val.replace(/-/g, '');

                        var isMobile = /^\+[0-9]+$/.test(val);
                        if (!isMobile) {
                            result.error = 'mobileDigitError';
                            return result;
                        }
                        result.value = val;
                    } else {
                        result.type = 'email';
                        if (!emailregexp.test(val)) {
                            result.error = 'emailError';
                            return result;
                        }
                        result.value = val;
                    }
                    return result;
                },
                signalRefreshWorkflow: function() {
                    $rootScope.$broadcast('event:signalRefreshWorkflow');
                },
                signalRenameWorkflow: function(val) {
                    renItem = val;
                    $rootScope.$broadcast('event:signalRenameWorkflow');
                },
                signalDuplicateWorkflow: function(val) {
                    dupItem = val;
                    $rootScope.$broadcast('event:signalDuplicateWorkflow');
                },
                getRenameItem: function() {
                    return renItem;
                },
                getDuplicateItem: function() {
                    return dupItem;
                },
                signalSetWorkflowList: function(val) {
                    l3SidenavItem = val;
                    $rootScope.$broadcast('event:signalSetWorkflowList');
                },
                getL3SideNavItem: function() {
                    return l3SidenavItem;
                },
                signalNotifyLinkState: function(val) {
                    notifyLinkState = val;
                    $rootScope.$broadcast('event:signalNotifyLinkState');
                },
                getNotifyLinkState: function() {
                    return notifyLinkState;
                },
                signalSidenavPopupState: function(val) {
                    sidenavPopupState = val;
                    $rootScope.$broadcast('event:signalSidenavPopupState');
                },
                getSidenavPopupState: function() {
                    return sidenavPopupState;
                },
                signalWidgetPopupState: function(val) {
                    widgetPopupState = val;
                    $rootScope.$broadcast('event:signalWidgetPopupState');
                },
                getWidgetPopupState: function() {
                    return widgetPopupState;
                },

                setLockState: function(val) {
                    lockState = val;
                },
                getLockState: function() {
                    return lockState;
                },

                signalLogicPreviewModuleId: function(val) {
                    console.log('Broadcast Event :::: showPreview');
                    previewModid = val;
                    $rootScope.$broadcast('event:showPreview');
                },
                getLogicPreviewModuleId: function() {
                    console.log('Retiurning Preview id .....' + previewModid);
                    return previewModid;
                },
                previewLayout: function(
                    widgetList,
                    mgrPreviewMap,
                    moduleItem,
                    contentType,
                    commFor,
                    configManagers,
                    branddata,
                    escalationemail,
                    finishModData,
                    intercomappid,
                    custlabels,
                    callback
                ) {
                    var body = angular.copy(widgetList);
                    //ideally body should not be null, rarely seen it is coming null for real users, added a safety check
                    if (!body) {
                        body = [];
                    }
                    body.forEach(function(bodyItem) {
                        if (
                            bodyItem.type === 'text' &&
                            bodyItem.hasOwnProperty('data')
                        ) {
                            bodyItem.data = S(bodyItem.data).template(
                                mgrPreviewMap
                            ).s;
                            bodyItem.text = S(bodyItem.data).template(
                                mgrPreviewMap
                            ).s;
                        }
                        if (
                            bodyItem.type === 'textSMS' &&
                            bodyItem.hasOwnProperty('data')
                        ) {
                            bodyItem.data = S(bodyItem.data).template(
                                mgrPreviewMap
                            ).s;
                            bodyItem.text = S(bodyItem.data).template(
                                mgrPreviewMap
                            ).s;
                        }
                        if (
                            bodyItem.type === 'button' &&
                            bodyItem.hasOwnProperty('data')
                        ) {
                            bodyItem.data = S(bodyItem.data).template(
                                mgrPreviewMap
                            ).s;
                        }
                        if (bodyItem.type === 'event') {
                            bodyItem.dtval = moment();
                            bodyItem.dtvalmm = moment().format('MMM');
                            bodyItem.dtvaldd = moment().format('DD');
                            bodyItem.dtvalday = moment().format('dddd');
                            bodyItem.dtvalyy = moment().format('YYYY');
                            bodyItem.dtvaldaycal = moment().format('ddd');
                        }
                    });

                    var moduledata = {
                        title: moduleItem.pagetitle,
                        body: body
                    };
                    if (!moduleItem.pagetitle) {
                        delete moduledata.title;
                    }

                    var item = {
                        // modtype: 'Content Editor',
                        modtype: contentType,
                        data: moduledata,
                        name: moduleItem.pagename,
                        chatboturl: moduleItem.chatboturl
                    };
                    // console.info('item :::  '+JSON.stringify(item));
                    if (contentType === 'communication') {
                        item.modtype = 'communication';
                        item.modfor = commFor;
                    }
                    if (contentType === 'multi-page') {
                        item.pages = moduleItem.pages
                            ? angular.copy(moduleItem.pages)
                            : {};
                        // fix empty cover title saved in preview table
                        if (
                            item.pages['cover'] &&
                            _.isEmpty(item.pages['cover'].title)
                        ) {
                            item.pages['cover'].title = ' ';
                        }
                        item.testinfo = moduleItem.testinfo
                            ? angular.copy(moduleItem.testinfo)
                            : {};
                        item.previewmode = moduleItem.previewmode;
                    }
                    if (contentType === 'embed-course') {
                        item.testinfo = moduleItem.testinfo
                            ? angular.copy(moduleItem.testinfo)
                            : {};
                        item.previewmode = moduleItem.previewmode;
                    }
                    if (contentType === 'video-rec') {
                        item.apiKey = moduleItem.apiKey;
                        item.myinterviewurl = moduleItem.myinterviewurl;
                    }
                    if (!branddata) {
                        //Fetch Branding Data
                        var brand_finish = Category.get(
                            {
                                purpose: 'Brand_Finishmodule'
                            },
                            function() {
                                var brand = brand_finish.brand;
                                branddata = {
                                    btnbg: brand.btnbg,
                                    btnfg: brand.btnfg,
                                    headerbg: brand.headerbg,
                                    headerfg: brand.headerfg,
                                    logo: brand.logo,
                                    logoCdn: brand.logoCdn,
                                    ckey: brand.ckey,
                                    name: brand.name,
                                    smsfrom: brand.smsfrom,
                                    emailfrom: brand.emailfrom,
                                    customfonts: brand_finish.customfonts
                                };
                                if (
                                    branddata.btnbg &&
                                    branddata.btnbg.toLowerCase() === '#ffffff'
                                ) {
                                    branddata.btnbg = '#f5f5f5';
                                }
                                item.defbrand = branddata;
                                item.configManagers = configManagers;
                                var prevData = {
                                    moddata: item,
                                    escalationemail:
                                        brand_finish.escalationemail,
                                    finishmod: brand_finish.finishmod,
                                    intercomappid: brand_finish.intercomappid,
                                    customLabels: custlabels
                                };
                                $sessionStorage.previewdata = prevData;
                                return callback(null, {
                                    branddata: branddata,
                                    escalationemail: prevData.escalationemail,
                                    finishmod: prevData.finishmod,
                                    intercomappid: prevData.intercomappid
                                });
                            }
                        );
                    } else {
                        item.defbrand = branddata;
                        item.configManagers = configManagers;
                        var prevData = {
                            moddata: item,
                            escalationemail: escalationemail,
                            finishmod: finishModData,
                            intercomappid: intercomappid,
                            customLabels: custlabels
                        };
                        $sessionStorage.previewdata = prevData;
                        return callback(null, {
                            branddata: branddata,
                            escalationemail: prevData.escalationemail,
                            finishmod: prevData.finishmod,
                            intercomappid: prevData.intercomappid
                        });
                    }
                }
            };
        }
    ])

    .factory('WFLevel2Service', [
        '$rootScope',
        '$mdDialog',
        '$http',
        function($rootScope, $mdDialog, $http) {
            var seqList = {};
            var canvasseq = {};
            var mgrList;
            var lockState;
            // list of configurable modules, by defalt all modules are invisible
            let configurablemodules;

            return {
                initializeConfigurableModules: function() {
                    configurablemodules = {
                        // 'learnapp': 'no',
                        'video-rec': 'yes'
                    };
                },
                // determines if the module
                isModuleVisible: function(modname) {
                    if (modname === 'multi-page') {
                        // multipage module is driven by the learnapp company flag
                        modname = 'learnapp';
                    }
                    // check if the module is driven by permission
                    if (configurablemodules[modname]) {
                        // console.log('[%s] module configured via permission : [%s]', modname, configurablemodules[modname]);
                        return configurablemodules[modname];
                    }
                    // console.log('[%s] module not configured via permission, always visible', modname);
                    return 'yes';
                },
                initVisibleModules: function(compconfig) {
                    this.initializeConfigurableModules();
                    for (let config in configurablemodules) {
                        configurablemodules[config] = 'no';
                        // see if configuration is defined for the company
                        if (compconfig[config]) {
                            configurablemodules[config] = compconfig[config];
                        }
                        // check if this is a feature for the company
                        if (
                            compconfig.features &&
                            compconfig.features[config]
                        ) {
                            configurablemodules[config] =
                                compconfig.features[config];
                        }
                    }
                },
                getSeqList: function() {
                    // console.info('Defn Service GET ::::: '+JSON.stringify(wfList));
                    return seqList;
                },
                setSeqList: function(val) {
                    // console.info('Defn Service SET withj VAL ::::: '+JSON.stringify(val));
                    seqList = val;
                    // console.info('Defn Service SET ::::: '+JSON.stringify(wfList));
                    // console.info('Defn Service SET ::::: ');
                    $rootScope.$broadcast('event:seqList');
                },

                getManagerList: function() {
                    // console.info('Defn Service GET ::::: '+JSON.stringify(wfList));
                    return mgrList;
                },
                setManagerList: function(val) {
                    // console.info('Defn Service SET withj VAL ::::: '+JSON.stringify(val));
                    mgrList = val;
                    // console.info('Defn Service SET ::::: '+JSON.stringify(wfList));
                    // console.info('Defn Service SET ::::: ');
                    $rootScope.$broadcast('event:mgrList');
                },

                setCanvasSeq: function(val) {
                    canvasseq = val;
                },
                getCanvasSeq: function(val) {
                    return canvasseq;
                },

                getModuleIcon: function(moduleicon, module) {
                    if (moduleicon === 'communication') {
                        return 'icon-conversation-small';
                    } else if (
                        moduleicon === 'multiple' ||
                        moduleicon === 'embed-link'
                    ) {
                        return 'icon-embed-small';
                    } else if (moduleicon === 'esign-docusign_test') {
                        return 'icon-e-signing-small';
                    } else if (moduleicon === 'esign-docusign_prod') {
                        return 'icon-e-signing-small';
                    } else if (moduleicon === 'esign-hellosign') {
                        return 'icon-e-signing-small';
                    } else if (moduleicon === 'esign-echosign') {
                        return 'icon-e-signing-small';
                    } else if (moduleicon === 'esign-securedsign') {
                        return 'icon-e-signing-small';
                    } else if (moduleicon === 'forms') {
                        if (
                            module &&
                            ((module.moduleid &&
                                module.moduleid.indexOf('473benchmark155_') ===
                                    0) ||
                                (module.modid &&
                                    module.modid.indexOf('473benchmark155_') ===
                                        0))
                        ) {
                            return 'icon-form-benchmark-small';
                        }
                        return 'icon-form-small';
                    } else if (moduleicon === 'acknowledge') {
                        return 'icon-acknowledge-small';
                    } else if (moduleicon === 'senddata') {
                        if (module) {
                            if (
                                module.sd_action === 'email' ||
                                module.action === 'email'
                            ) {
                                return 'icon-send-email';
                            } else if (
                                module.sd_action === 'webhook' ||
                                module.action === 'webhook'
                            ) {
                                return 'icon-send-webhook';
                            }
                            if (
                                module.sd_action === 'updateval' ||
                                module.action === 'updateval'
                            ) {
                                return 'icon-send-value';
                            }
                        }
                        return 'icon-senddata-small'; // default
                    } else if (moduleicon === 'logic') {
                        return 'icon-logic-small';
                    } else if (moduleicon === 'notification') {
                        return 'icon-notification-small';
                    } else if (moduleicon === 'finish') {
                        return 'icon-verification-small';
                    } else if (moduleicon === 'Content Editor') {
                        return 'icon-content-small';
                    } else if (moduleicon === 'esign') {
                        return 'icon-e-signing-small';
                    } else if (moduleicon === 'event') {
                        return 'icon-event-small';
                    } else if (moduleicon === 'I9') {
                        return 'icon-I9-small';
                    } else if (moduleicon === 'multi-page') {
                        return 'icon-multi-page-small';
                    } else if (moduleicon === 'video-rec') {
                        return 'icon-video-rec-small';
                    } else if (moduleicon === 'embed-course') {
                        return 'icon-embed-course-small';
                    }

                    return 'icon-' + moduleicon;
                },

                checkAttachedSequences: function(phase, seqid) {
                    for (var i = 0; i < canvasseq['' + phase].length; i++) {
                        for (
                            var j = 0;
                            j < canvasseq['' + phase][i].seq.length;
                            j++
                        ) {
                            if (
                                (canvasseq['' + phase][i].seq[j].crittype ===
                                    'sequence' ||
                                    canvasseq['' + phase][i].seq[j].crittype ===
                                        'seqtrigger') &&
                                canvasseq['' + phase][i].seq[j].critseq ===
                                    seqid
                            ) {
                                return {
                                    seqid: canvasseq['' + phase][i].seq[j].uid,
                                    seqname:
                                        canvasseq['' + phase][i].seq[j].name
                                };
                            }
                        }
                    }
                }, //end checkAttachedSequences

                setLockState: function(val) {
                    lockState = val;
                },

                getLockState: function() {
                    return lockState;
                },

                getModuleUrlPath: function(modiconname, wfid, seqid, modid) {
                    console.log(
                        'Inside getModuleUrlPath modiconname [%s], wfid[%s], seqid[%s], modid[%s]',
                        modiconname,
                        wfid,
                        seqid,
                        modid
                    );
                    let modtype = _.replace(modiconname, '-small', '');
                    let type = modtype;
                    if (_.includes(modtype, 'esign')) {
                        modtype = _.replace(modtype, 'esign-', '');
                        type = 'esign';
                    } else if (
                        _.includes(modtype, 'multiple') ||
                        _.includes(modtype, 'embed-link')
                    ) {
                        modtype = 'embed-link';
                        type = 'content';
                    } else if (
                        _.includes(modtype, 'notification') ||
                        _.includes(modtype, 'verification') ||
                        _.includes(modtype, 'finish')
                    ) {
                        modtype = 'none';
                        type = 'content';
                    } else if (
                        modtype === 'communication' ||
                        modtype === 'event' ||
                        modtype === 'acknowledge' ||
                        modtype === 'I9' ||
                        modtype === 'video-rec'
                    ) {
                        type = 'content';
                    }
                    if (seqid) {
                        return (
                            '/workflow-' +
                            type +
                            '-editor-seq/' +
                            modtype +
                            '/wf/' +
                            wfid +
                            '/' +
                            seqid +
                            '/' +
                            modid
                        );
                    } else {
                        return (
                            '/workflow-' +
                            type +
                            '-editor/' +
                            modtype +
                            '/wf/' +
                            wfid +
                            '/' +
                            modid
                        );
                    }
                }
            };
        }
    ])

    .factory('WFLevel3Service', [
        '$rootScope',
        '$mdDialog',
        '$http',
        '$sce',
        'CustLabels',
        function($rootScope, $mdDialog, $http, $sce, CustLabels) {
            var lockState;
            return {
                getVideoUrl: function(srcVideoUrl) {
                    var newVideoUrl = srcVideoUrl;
                    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                    var regExpVimeo = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
                    var regExpYouku = /https?:\/\/v\.youku\.com\/v_show\/id_(\w+)/;
                    var match = srcVideoUrl.match(regExp);
                    var matchVimeo = srcVideoUrl.match(regExpVimeo);
                    var matchYouku = srcVideoUrl.match(regExpYouku);

                    if (match && match[7].length == 11) {
                        newVideoUrl =
                            'https://www.youtube.com/embed/' +
                            match[7] +
                            '?rel=0&showinfo=0';
                    }
                    if (matchVimeo && matchVimeo[3].length == 9) {
                        newVideoUrl =
                            'https://player.vimeo.com/video/' +
                            matchVimeo[3] +
                            '?portrait=false&title=false&byline=false';
                    }
                    if (matchYouku && matchYouku[1].length == 15) {
                        newVideoUrl =
                            'https://player.youku.com/embed/' +
                            matchYouku[1] +
                            '==';
                    }
                    if (srcVideoUrl.indexOf('wistia.com/') !== -1) {
                        var wistiaArr = srcVideoUrl.split('/');
                        newVideoUrl =
                            'https://fast.wistia.net/embed/iframe/' +
                            wistiaArr[wistiaArr.length - 1] +
                            '?seo=false&videoFoam=true';
                    }
                    if (srcVideoUrl.indexOf('kaltura.com/') !== -1) {
                        return srcVideoUrl;
                    }

                    //If video url does not start with http, clear the entered url
                    if (newVideoUrl.indexOf('https') === -1) {
                        newVideoUrl = '';
                    }
                    return newVideoUrl;
                },

                calculateReadTimeMultiPage: function(pages) {
                    //Use the alorithm described here
                    //https://blog.medium.com/read-time-and-you-bc2048ab620c
                    //Every Image = 12 seconds
                    //PDF and Video take from defined data , if not defined or 0 do not count
                    //Text : Word per Minute 275
                    let timeMap = {};
                    Object.keys(pages).forEach(function(pageKey) {
                        if (pageKey.indexOf('page') === -1) {
                            return;
                        }
                        let time = 0;
                        let words = 0;
                        pages[pageKey]['body'].forEach(function(widgetItem) {
                            if (widgetItem.type === 'text') {
                                if (widgetItem.data) {
                                    words += widgetItem.data.split(
                                        / |&nbsp;|\n/
                                    ).length;
                                }
                            } else if (widgetItem.type === 'image') {
                                time += 12;
                            } else if (
                                widgetItem.type === 'video' &&
                                widgetItem.timeest > 0
                            ) {
                                time += widgetItem.timeest * 60;
                            } else if (widgetItem.type === 'filedownload') {
                                _.forEach(widgetItem.attcharr, attch => {
                                    time += attch.timeest * 60;
                                });
                            }
                        });
                        if (words > 0) {
                            time = time + Math.ceil(words / 275) * 60;
                        }
                        time = Math.ceil(time / 60);

                        timeMap[pageKey] = time;
                    });
                    console.log('timeMap  ==== ' + JSON.stringify(timeMap));
                    return timeMap;
                },
                getOptionsFieldsMenu: function(
                    optionName,
                    editor,
                    dropdownOptions,
                    employeeLabel,
                    prflFieldOptions
                ) {
                    var options = {
                        text: optionName,
                        menu: []
                    };

                    if (optionName === 'Names') {
                        options.menu.push({
                            text: 'Account name',
                            onclick: function() {
                                editor.insertContent('{{account_name}}');
                            }
                        });
                        // delete dropdownOptions['{{company_name}}'];
                        // delete  dropdownOptions['{{newhire_startdt}}'];
                        var nameMap = {};
                        var nameLabelMap = {};

                        _.forEach(dropdownOptions, function(value, key) {
                            if (
                                key === '{{newhire_startdt}}' ||
                                key === '{{account_name}}'
                            ) {
                                return;
                            }
                            // console.log('key is ::: %s and value is %s',key,value);
                            var strippedKey = key
                                .replace('_firstname', '')
                                .replace('_lastname', '')
                                .replace('_name', '')
                                .replace('_contact', '')
                                .replace('_mobile', '')
                                .replace('_email', '');
                            // console.log('Stripped key is ::: ', strippedKey, key, value);
                            if (!nameMap[strippedKey]) {
                                nameMap[strippedKey] = {};
                            }
                            nameMap[strippedKey][key] = value;
                            if (_.endsWith(value, ' Contact Details')) {
                                nameLabelMap[strippedKey] = value.replace(
                                    ' Contact Details',
                                    ''
                                );
                            }
                        });
                        _.forEach(nameMap, function(value, key) {
                            var secondMenu = {
                                text: nameLabelMap[key],
                                menu: []
                            };
                            _.forEach(value, function(secvalue, seckey) {
                                // secvalue = secvalue.replace(' (First name)','').replace(' (Last name)','').replace(' (Full name)','').replace(' Contact Details','');
                                secvalue = secvalue
                                    .replace(nameLabelMap[key] + ' ', '')
                                    .replace('(', '')
                                    .replace(')', '');
                                secondMenu.menu.push({
                                    text: secvalue,
                                    onclick: function() {
                                        editor.insertContent(seckey);
                                    }
                                });
                            });
                            // now add profile fields to the names
                            _.forEach(prflFieldOptions, function(
                                pffield,
                                pfid
                            ) {
                                // key is the new hire or manager name i.e. {{newhire}} or {{mgrlbl}}
                                // so append the profile field name with participant and append
                                // to secondary dropdown
                                let pfkey = key.replace('}}', `_${pfid}}}`);
                                secondMenu.menu.push({
                                    text: pffield,
                                    onclick: function() {
                                        editor.insertContent(pfkey);
                                    }
                                });
                            });
                            if (secondMenu.text === 'Employee') {
                                secondMenu.text = employeeLabel;
                            }
                            options.menu.push(secondMenu);
                        });
                    } else {
                        _.forEach(dropdownOptions, function(value, key) {
                            options.menu.push({
                                text: value,
                                onclick: function() {
                                    editor.insertContent(key);
                                }
                            });
                        });
                    }
                    return options;
                },
                getFormOptionsFieldsMenu: function(
                    optionName,
                    editor,
                    formDropdownOptions
                ) {
                    var options = {
                        text: optionName,
                        menu: []
                    };
                    formDropdownOptions.forEach(function(formItem) {
                        if (!formItem.formfields) {
                            return;
                        }
                        var secondMenu = { text: formItem.formname, menu: [] };
                        formItem.formfields.forEach(function(element) {
                            var insertKey = '{{form';
                            // var insertKey = '{{form/'+formItem.formname +'/'+element.fnm+'}}';
                            // insertKey = S(S(insertKey).collapseWhitespace().s).replaceAll(' ', '_').s;
                            // insertKey = insertKey.toLowerCase();
                            var formName = S(
                                S(formItem.formname).collapseWhitespace().s
                            ).replaceAll(' ', '_').s;
                            formName = formName.toLowerCase();

                            var elementName = S(
                                S(element.fnm).collapseWhitespace().s
                            ).replaceAll(' ', '_').s;
                            elementName = elementName.toLowerCase();
                            // var insertKeyArr = insertKey.split('/');
                            // insertKey = insertKeyArr[0] +' / ' +insertKeyArr[1]+' / '+insertKeyArr[2];
                            insertKey =
                                insertKey +
                                ' / ' +
                                formName +
                                ' / ' +
                                elementName +
                                '}}';
                            secondMenu.menu.push({
                                text: element.fnm,
                                onclick: function() {
                                    editor.insertContent(insertKey);
                                }
                            });
                        });
                        options.menu.push(secondMenu);
                    });
                    return options;
                },

                processWidgetList: function(
                    widgetList,
                    mgrLblReverseMap,
                    commFor,
                    commManagers,
                    configManagers,
                    eventFieldData,
                    changeConfigManager
                ) {
                    let commType;
                    let embedWidget;
                    let textDataLength;
                    let retWidgetList = widgetList.map(function(widget, index) {
                        // console.log('Process for Widget.... ',widget);
                        if (widget.type === 'video') {
                            widget.safevideourl = $sce.trustAsResourceUrl(
                                widget.data
                            );
                        } else if (
                            widget.type === 'embedlink' ||
                            widget.type === 'embed-course'
                        ) {
                            //This is done for backward data compatibility
                            if (!widget.popup) {
                                widget.popup = 'no';
                            }
                            if (widget.data) {
                                widget.data = S(widget.data).template(
                                    mgrLblReverseMap
                                ).s;
                                widget.safeurl = $sce.trustAsResourceUrl(
                                    widget.data
                                );
                            }

                            if (widget.embedparams) {
                                widget.embedparams.forEach(function(
                                    embedparam
                                ) {
                                    if (embedparam.key) {
                                        embedparam.key = S(
                                            embedparam.key
                                        ).template(mgrLblReverseMap).s;
                                    }
                                    if (embedparam.maunaltext) {
                                        embedparam.maunaltext = S(
                                            embedparam.maunaltext
                                        ).template(mgrLblReverseMap).s;
                                    }
                                });
                            }
                            if (widget.popuptext) {
                                widget.popuptext = S(widget.popuptext).template(
                                    mgrLblReverseMap
                                ).s;
                            }
                            embedWidget = widget;
                        } else if (widget.type === 'acknowledgement') {
                            if (widget.dec_text) {
                                widget.dec_text = S(widget.dec_text).template(
                                    mgrLblReverseMap
                                ).s;
                            }
                            if (widget.confmsg) {
                                widget.confmsg = S(widget.confmsg).template(
                                    mgrLblReverseMap
                                ).s;
                            }
                        } else if (widget.type === 'button') {
                            if (widget.data) {
                                widget.data = S(widget.data).template(
                                    mgrLblReverseMap
                                ).s;
                                widget.safebuttonurl = $sce.trustAsResourceUrl(
                                    widget.data
                                );
                            }
                        } else if (widget.type === 'image') {
                            console.log(
                                'widget   ::;' + JSON.stringify(widget)
                            );
                            if (
                                widget.fullimage == true ||
                                widget.fullimage === 'true'
                            ) {
                                widget.smallimage = 'no';
                                widget.mediumimage = 'no';
                                widget.fullimage = 'yes';
                                widget.animate = 'no';
                            } else if (widget.fullimage == false) {
                                widget.smallimage = 'no';
                                widget.mediumimage = 'yes';
                                widget.fullimage = 'no';
                                widget.animate = 'no';
                            }
                            if (!widget.fullimage || !widget.smallimage) {
                                widget.mediumimage = 'yes';
                            }
                        } else if (widget.type === 'text') {
                            if (widget.data) {
                                if (!widget.subject) {
                                    // default value for subject
                                    if (commFor === 'M') {
                                        widget.subject =
                                            'You have a message regarding {{newhire_name}}';
                                    } else {
                                        widget.subject =
                                            'You have a message from {{val_cat_brand}}';
                                    }
                                }
                                widget.data = S(widget.data).template(
                                    mgrLblReverseMap
                                ).s;
                                widget.subject = S(widget.subject).template(
                                    mgrLblReverseMap
                                ).s;
                                widget.text = $sce.trustAsHtml(widget.data);
                                if (widget.subject) {
                                    // $scope.textDataLength = $(widget.data).text().length;
                                    textDataLength = $(widget.data).text()
                                        .length;
                                }
                                if (!widget.bgcolor) {
                                    // default is white
                                    widget.bgcolor = '#ffffff';
                                }
                            }
                        } else if (widget.type === 'textSMS') {
                            if (widget.data) {
                                widget.data = S(widget.data).template(
                                    mgrLblReverseMap
                                ).s;
                                widget.text = $sce.trustAsHtml(widget.data);
                            }

                            if (typeof widget.showphone === 'undefined') {
                                widget.showphone = true;
                            }
                            if (!widget.showtextmessage) {
                                widget.showtextmessage = 'yes';
                            }
                            if (commFor === 'M' && !widget.mgrid) {
                                widget.mgrid = commManagers[0].uid;
                            }
                            if (commFor === 'NH') {
                                widget.mgrid = 'nhid';
                            }
                            changeConfigManager(widget.mgrid);
                            // $scope.changeConfigManager(widget.mgrid);
                            var commMgrFound = false;
                            commManagers.forEach(function(commMgr) {
                                if (commMgr.uid === widget.mgrid) {
                                    commMgrFound = true;
                                    if (commMgr.t === 's' && commMgr.e) {
                                        // $scope.commType = 'email';
                                        commType = 'email';
                                    }
                                }
                            });
                            //Manager not found, get it from config managers and add it as Not Available
                            if (!commMgrFound) {
                                configManagers.forEach(function(cfgMgr) {
                                    if (cfgMgr.uid === widget.mgrid) {
                                        if (cfgMgr.t === 's' && cfgMgr.e) {
                                            // $scope.commType = 'email';
                                            commType = 'email';
                                        }
                                        cfgMgr.l =
                                            cfgMgr.l + ' (Not Available)';
                                        commManagers.push(cfgMgr);
                                    }
                                });
                            }
                        } else if (widget.type === 'event') {
                            // widget.fielddata = $scope.prepareEventFieldData();
                            // $scope.setupEventTokens();
                            widget.fielddata = eventFieldData;
                            if (!_.isEmpty(widget.nm)) {
                                widget.nm = S(widget.nm).template(
                                    mgrLblReverseMap
                                ).s;
                            }
                            if (!_.isEmpty(widget.loc)) {
                                widget.loc = S(widget.loc).template(
                                    mgrLblReverseMap
                                ).s;
                            }
                            if (!_.isEmpty(widget.desc)) {
                                widget.desc = S(widget.desc).template(
                                    mgrLblReverseMap
                                ).s;
                            }
                            if (!widget.hasOwnProperty('rptfrq')) {
                                widget.rpt = 'n';
                                widget.rptfrq = 'wk';
                            } else {
                                widget.rpt = 'y';
                            }
                            if (widget.ad === 'y') {
                                widget.tmfrm = 'All day';
                                widget.tmto = 'All day';
                            }
                            return widget;
                        }
                        return widget;
                    });

                    let retData = { widgetlist: retWidgetList };
                    if (embedWidget) {
                        retData.embedwidget = embedWidget;
                    }
                    if (commType) {
                        retData.commtype = commType;
                    }
                    //textDataLength is numeric, so I want 0 value to work fine
                    if (typeof textDataLength !== 'undefined') {
                        retData.textdatalength = textDataLength;
                    }
                    return retData;
                },
                prepareDynamicTokensMap: function(
                    mgrres,
                    modwfid,
                    modid,
                    custlabels,
                    prflFields
                ) {
                    var labelMap = {};
                    var mgrLblMap = {
                        newhire_startdt: '{{newhire_startdt}}',
                        company_name: '{{account_name}}',
                        account_name: '{{account_name}}',
                        newhire_firstname: '{{newhire_firstname}}',
                        newhire_lastname: '{{newhire_lastname}}',
                        newhire_name: '{{newhire_name}}',
                        newhire_contact: '{{newhire_contact}}',
                        newhire_mobile: '{{newhire_mobile}}',
                        newhire_email: '{{newhire_email}}'
                    };
                    var mgrLblReverseMap = {
                        newhire_startdt: '{{newhire_startdt}}',
                        company_name: '{{account_name}}',
                        account_name: '{{account_name}}',
                        newhire_firstname: '{{newhire_firstname}}',
                        newhire_lastname: '{{newhire_lastname}}',
                        newhire_name: '{{newhire_name}}',
                        newhire_contact: '{{newhire_contact}}',
                        newhire_mobile: '{{newhire_mobile}}',
                        newhire_email: '{{newhire_email}}'
                    };
                    var mgrPreviewMap = {
                        newhire_startdt: '{{newhire_startdt}}',
                        company_name: '{{account_name}}',
                        account_name: '{{account_name}}',
                        newhire_firstname: '{{newhire_firstname}}',
                        newhire_lastname: '{{newhire_lastname}}',
                        newhire_name: '{{newhire_name}}',
                        newhire_contact: '{{newhire_contact}}',
                        newhire_mobile: '{{newhire_mobile}}',
                        newhire_email: '{{newhire_email}}'
                    };
                    var dropdownOptions = {
                        '{{newhire_startdt}}': 'Start date',
                        '{{account_name}}': 'Account name',
                        '{{newhire_firstname}}':
                            (custlabels.Employee || 'Employee') +
                            ' (First name)',
                        '{{newhire_lastname}}':
                            (custlabels.Employee || 'Employee') +
                            ' (Last name)',
                        '{{newhire_name}}':
                            (custlabels.Employee || 'Employee') +
                            ' (Full name)',
                        '{{newhire_contact}}':
                            (custlabels.Employee || 'Employee') +
                            ' Contact Details',
                        '{{newhire_mobile}}':
                            (custlabels.Employee || 'Employee') + ' Mobile',
                        '{{newhire_email}}':
                            (custlabels.Employee || 'Employee') + ' Email'
                    };
                    var prflFieldOptions = {};
                    _.forEach(prflFields, pf => {
                        let pfToken = S(
                            S(pf.nm).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        pfToken = pfToken.toLowerCase();
                        // dropdownOptions[`{{newhire_prfl_${pfToken}}}`] = pf.nm;
                        mgrLblMap[
                            `newhire_${pfToken}`
                        ] = `{{val_prfl_nhid#${pf.uid}}}`;
                        mgrLblReverseMap[
                            `val_prfl_nhid#${pf.uid}`
                        ] = `{{newhire_${pfToken}}}`;
                        mgrPreviewMap[
                            `newhire_${pfToken}`
                        ] = `{{newhire_${pfToken}}}`;
                        prflFieldOptions[`${pfToken}`] = pf.nm;
                    });
                    var cfOptions = {};
                    var wfManagers;
                    var wfcf;
                    var configcf;
                    var configManagers;
                    if (modwfid && modwfid !== 'default') {
                        configManagers = mgrres.configManagers;
                        wfManagers = mgrres.wfManagers;
                        if (!wfManagers) {
                            wfManagers = [];
                        }
                        wfcf = mgrres.wfcf;
                        if (!wfcf) {
                            wfcf = [];
                        }
                        configcf = mgrres.configcf;
                        if (!configcf) {
                            configcf = [];
                        }
                    } else {
                        configManagers = mgrres.configManagers || [];
                        wfManagers = [];
                        wfcf = [];
                        configcf = [];
                    }

                    // var index = 0;
                    var commManagers = [];
                    // Employee will be first dropdown
                    commManagers.push({
                        l:
                            custlabels && custlabels.Employee
                                ? custlabels.Employee
                                : 'Employee',
                        t: 'd',
                        uid: 'nhid',
                        modfor: 'NH'
                    });
                    if (configManagers.length > 0) {
                        var firstManager = configManagers[0];

                        var lblToken = S(
                            S(firstManager.l).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        lblToken = lblToken.toLowerCase();
                        mgrLblMap['manager_firstname'] =
                            '{{' + firstManager.uid + '_firstname}}';
                        mgrLblMap['manager_name'] =
                            '{{' + firstManager.uid + '_name}}';
                        mgrLblReverseMap['manager_firstname'] =
                            '{{' + lblToken + '_firstname}}';
                        mgrLblReverseMap['manager_name'] =
                            '{{' + lblToken + '_name}}';

                        mgrLblMap['' + lblToken + '_firstname'] =
                            '{{' + firstManager.uid + '_firstname}}';
                        mgrLblMap['' + lblToken + '_name'] =
                            '{{' + firstManager.uid + '_name}}';

                        mgrLblReverseMap['' + firstManager.uid + '_firstname'] =
                            '{{' + lblToken + '_firstname}}';
                        mgrLblReverseMap['' + firstManager.uid + '_name'] =
                            '{{' + lblToken + '_name}}';

                        mgrPreviewMap['' + lblToken + '_firstname'] =
                            '{{' + lblToken + '_firstname}}';
                        mgrPreviewMap['' + lblToken + '_name'] =
                            '{{' + lblToken + '_name}}';
                    }

                    configManagers.forEach(function(mgr) {
                        var wfmgrFound = false;
                        if (wfManagers.length > 0) {
                            for (var i = 0; i < wfManagers.length; i++) {
                                if (wfManagers[i].uid === mgr.uid) {
                                    wfmgrFound = true;
                                }
                            }
                        } else {
                            wfmgrFound = false;
                        }
                        if (!wfmgrFound) {
                            return;
                        }

                        mgr.modfor = 'M';
                        commManagers.push(mgr);

                        lblToken = S(
                            S(mgr.l).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        lblToken = lblToken.toLowerCase();

                        dropdownOptions['{{' + lblToken + '_firstname}}'] =
                            mgr.l + ' (First name)';
                        dropdownOptions['{{' + lblToken + '_lastname}}'] =
                            mgr.l + ' (Last name)';
                        dropdownOptions['{{' + lblToken + '_name}}'] =
                            mgr.l + ' (Full name)';
                        dropdownOptions['{{' + lblToken + '_contact}}'] =
                            mgr.l + ' Contact Details';
                        if (mgr.t === 'd') {
                            dropdownOptions['{{' + lblToken + '_mobile}}'] =
                                mgr.l + ' Mobile';
                            dropdownOptions['{{' + lblToken + '_email}}'] =
                                mgr.l + ' Email';
                        }

                        mgrLblMap['' + lblToken + '_firstname'] =
                            '{{' + mgr.uid + '_firstname}}';
                        mgrLblMap['' + lblToken + '_lastname'] =
                            '{{' + mgr.uid + '_lastname}}';
                        mgrLblMap['' + lblToken + '_name'] =
                            '{{' + mgr.uid + '_name}}';
                        mgrLblMap['' + lblToken + '_contact'] =
                            '{{' + mgr.uid + '_contact}}';
                        if (mgr.t === 'd') {
                            mgrLblMap['' + lblToken + '_mobile'] =
                                '{{' + mgr.uid + '_mobile}}';
                            mgrLblMap['' + lblToken + '_email'] =
                                '{{' + mgr.uid + '_email}}';
                        }

                        mgrLblReverseMap['' + mgr.uid + '_firstname'] =
                            '{{' + lblToken + '_firstname}}';
                        mgrLblReverseMap['' + mgr.uid + '_lastname'] =
                            '{{' + lblToken + '_lastname}}';
                        mgrLblReverseMap['' + mgr.uid + '_name'] =
                            '{{' + lblToken + '_name}}';
                        mgrLblReverseMap['' + mgr.uid + '_contact'] =
                            '{{' + lblToken + '_contact}}';
                        if (mgr.t === 'd') {
                            mgrLblReverseMap['' + mgr.uid + '_mobile'] =
                                '{{' + lblToken + '_mobile}}';
                            mgrLblReverseMap['' + mgr.uid + '_email'] =
                                '{{' + lblToken + '_email}}';
                        }

                        mgrPreviewMap['' + lblToken + '_firstname'] =
                            '{{' + lblToken + '_firstname}}';
                        mgrPreviewMap['' + lblToken + '_lastname'] =
                            '{{' + lblToken + '_lastname}}';
                        mgrPreviewMap['' + lblToken + '_name'] =
                            '{{' + lblToken + '_name}}';
                        mgrPreviewMap['' + lblToken + '_contact'] =
                            '{{' + lblToken + '_contact}}';
                        if (mgr.t === 'd') {
                            mgrPreviewMap['' + lblToken + '_mobile'] =
                                '{{' + lblToken + '_mobile}}';
                            mgrPreviewMap['' + lblToken + '_email'] =
                                '{{' + lblToken + '_email}}';
                        }
                        _.forEach(prflFields, pf => {
                            let pfToken = S(
                                S(pf.nm).collapseWhitespace().s
                            ).replaceAll(' ', '_').s;
                            pfToken = pfToken.toLowerCase();
                            mgrLblMap[
                                `${lblToken}_${pfToken}`
                            ] = `{{val_prfl_${mgr.uid}#${pf.uid}}}`;
                            mgrLblReverseMap[
                                `val_prfl_${mgr.uid}#${pf.uid}`
                            ] = `{{${lblToken}_${pfToken}}}`;
                            mgrPreviewMap[
                                `${lblToken}_${pfToken}`
                            ] = `{{${lblToken}_${pfToken}}}`;
                        });
                        if (mgr.t === 's') {
                            var fullname = mgr.n;
                            var firstname = fullname.split(' ')[0];
                            mgrPreviewMap[
                                '' + lblToken + '_firstname'
                            ] = firstname;
                            if (fullname && fullname.indexOf(' ') != -1) {
                                mgrPreviewMap[
                                    '' + lblToken + '_lastname'
                                ] = fullname.substring(
                                    fullname.indexOf(' ') + 1
                                );
                            }
                            mgrPreviewMap['' + lblToken + '_name'] = fullname;
                            mgrPreviewMap['' + lblToken + '_contact'] = mgr.m
                                ? mgr.m
                                : mgr.e;
                        }

                        // index++;
                    });

                    var cfAnswerOptions = [];
                    configcf.forEach(function(cf) {
                        var wfcfFound = false;
                        for (var i = 0; i < wfcf.length; i++) {
                            if (wfcf[i].uid === cf.uid) {
                                wfcfFound = true;
                            }
                        }
                        if (!wfcfFound) {
                            return;
                        }
                        lblToken = S(
                            S(cf.nm).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        lblToken = lblToken.toLowerCase();
                        cfOptions['{{custom / ' + lblToken + '}}'] = cf.nm;
                        cfAnswerOptions.push({
                            typ: cf.typ,
                            nm: cf.nm,
                            uid: '{{' + cf.uid + '}}'
                        });

                        mgrLblMap['custom / ' + lblToken] =
                            '{{' + cf.uid + '}}';
                        mgrLblReverseMap['' + cf.uid] =
                            '{{custom / ' + lblToken + '}}';
                        mgrPreviewMap['custom / ' + lblToken] =
                            '{{custom / ' + lblToken + '}}';
                    });

                    var catdropdown = { '{{category / brand}}': 'Brand' };

                    mgrLblMap['category / brand'] = '{{val_cat_brand}}';
                    mgrLblReverseMap['val_cat_brand'] = '{{category / brand}}';
                    mgrPreviewMap['category / brand'] = '{{category / brand}}';

                    catdropdown['{{category / location}}'] = 'Location';
                    mgrLblMap['category / location'] = '{{val_cat_location}}';
                    mgrLblReverseMap['val_cat_location'] =
                        '{{category / location}}';
                    mgrPreviewMap['category / location'] =
                        '{{category / location}}';

                    catdropdown['{{category / location address}}'] =
                        'Location Address';
                    mgrLblMap['category / location address'] =
                        '{{val_cat_location_address}}';
                    mgrLblReverseMap['val_cat_location_address'] =
                        '{{category / location address}}';
                    mgrPreviewMap['category / location address'] =
                        '{{category / location address}}';

                    mgrres.optcat.forEach(function(cat) {
                        lblToken = S(
                            S(cat.name).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        lblToken = lblToken.toLowerCase();

                        catdropdown['{{category / ' + lblToken + '}}'] =
                            cat.name;

                        mgrLblMap['category / ' + lblToken] =
                            '{{val_cat_' + cat.tkey + '}}';
                        mgrLblReverseMap['val_cat_' + cat.tkey] =
                            '{{category / ' + lblToken + '}}';
                        mgrPreviewMap['category / ' + lblToken] =
                            '{{category / ' + lblToken + '}}';
                    });

                    var ackOptions = {};
                    mgrres.acknowledgement.forEach(function(ackMod) {
                        if (ackMod.uid === modid) {
                            return;
                        }
                        //Do not show ack modules without title
                        if (!ackMod.name) {
                            return;
                        }
                        lblToken = S(
                            S(ackMod.name).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        lblToken = lblToken.toLowerCase();

                        ackOptions['{{acknowledgement / ' + lblToken + '}}'] =
                            ackMod.name;

                        mgrLblMap['acknowledgement / ' + lblToken] =
                            '{{val_ack_' + ackMod.uid + '}}';
                        mgrLblReverseMap['val_ack_' + ackMod.uid] =
                            '{{acknowledgement / ' + lblToken + '}}';
                        // mgrPreviewMap['acknowledgement / '+lblToken] = '{{acknowledgement / '+lblToken+'}}';
                        mgrPreviewMap['acknowledgement / ' + lblToken] =
                            '{{val_ack_' + ackMod.uid + '}}';
                    });

                    let videorecOptions = {};
                    _.forEach(mgrres.myinterview, function(videorec) {
                        if (videorec.uid === modid) {
                            return;
                        }
                        //Do not show video recording modules without title
                        if (!videorec.name) {
                            return;
                        }
                        lblToken = S(
                            S(videorec.name).collapseWhitespace().s
                        ).replaceAll(' ', '_').s;
                        lblToken = lblToken.toLowerCase();

                        videorecOptions[
                            '{{video_recording / ' + lblToken + '}}'
                        ] = videorec.name;

                        mgrLblMap['video_recording / ' + lblToken] =
                            '{{val_video_rec_' + videorec.uid + '}}';
                        mgrLblReverseMap['val_video_rec_' + videorec.uid] =
                            '{{video_recording / ' + lblToken + '}}';
                        //mgrPreviewMap['video_recording / '+lblToken] = '{{val_video_rec_'+videorec.uid+'}}';
                        mgrPreviewMap['video_recording / ' + lblToken] =
                            '<span><span class="video vdrc"><span class="container"><span class="bgani"></span><span class="emptvidtxt">No video recorded yet</span></span></span></span>';
                    });

                    var formDropdownOptions = mgrres.formsdata;
                    if (!formDropdownOptions) {
                        formDropdownOptions = [];
                    }

                    var formIndex = -1;
                    var matchIndex = -1;
                    formDropdownOptions.forEach(function(formItem) {
                        formIndex++;
                        if (!formItem.formfields) {
                            return;
                        }
                        if (formItem.formid === modid) {
                            matchIndex = formIndex;
                            return;
                        }
                        formItem.formfields.forEach(function(element) {
                            // lblToken = formItem.formname +'/'+element.fnm;
                            // lblToken = S(S(lblToken).collapseWhitespace().s).replaceAll(' ', '_').s;
                            // lblToken = lblToken.toLowerCase();
                            // lblToken = lblToken.split('/')[0]+' / '+lblToken.split('/')[1];

                            var formName = S(
                                S(formItem.formname).collapseWhitespace().s
                            ).replaceAll(' ', '_').s;
                            formName = formName.toLowerCase();
                            var elememtName = S(
                                S(element.fnm).collapseWhitespace().s
                            ).replaceAll(' ', '_').s;
                            elememtName = elememtName.toLowerCase();
                            lblToken = formName + ' / ' + elememtName;

                            mgrLblMap['form / ' + lblToken] =
                                '{{val_form_' +
                                formItem.formid +
                                '#' +
                                element.uid +
                                '}}';
                            mgrLblReverseMap[
                                'val_form_' +
                                    formItem.formid +
                                    '#' +
                                    element.uid
                            ] = '{{form / ' + lblToken + '}}';
                            mgrPreviewMap['form / ' + lblToken] =
                                '{{form / ' + lblToken + '}}';
                        });
                    });

                    //Remove the current form from Options
                    if (matchIndex > -1) {
                        formDropdownOptions.splice(matchIndex, 1);
                    }

                    labelMap.mgrLblMap = mgrLblMap;
                    labelMap.mgrLblReverseMap = mgrLblReverseMap;
                    labelMap.mgrPreviewMap = mgrPreviewMap;
                    labelMap.commManagers = commManagers;
                    labelMap.configManagers = configManagers;
                    labelMap.empmgr = dropdownOptions;
                    labelMap.catdropdown = catdropdown;
                    labelMap.cfOptions = cfOptions;
                    labelMap.ackOptions = ackOptions;
                    labelMap.videorecOptions = videorecOptions;
                    labelMap.cfAnswerOptions = cfAnswerOptions;
                    labelMap.formDropdownOptions = formDropdownOptions;
                    labelMap.prflFieldOptions = prflFieldOptions;
                    return labelMap;
                },
                // this method should not be overloaded with more parameters now, let's use extraParams as overloading parameter module
                getTinymceOptions: function(
                    service,
                    dropdownOptions,
                    catdropdown,
                    cfOptions,
                    formDropdownOptions,
                    ackOptions,
                    comm,
                    btnParams,
                    videorecOptions,
                    fontOptions,
                    prflFieldOptions
                ) {
                    // console.log('CustLabels.getCustomLabels() ==============', CustLabels.getCustomLabels())
                    let employeeLabel =
                        CustLabels.getCustomLabels() &&
                        CustLabels.getCustomLabels().Employee
                            ? CustLabels.getCustomLabels().Employee
                            : 'Employee';
                    let fontEnabled =
                        fontOptions &&
                        fontOptions.fonts &&
                        fontOptions.fonts.length > 0
                            ? 'yes'
                            : 'no';
                    var tinymceOpt = {
                        selector: 'textarea',
                        entity_encoding: 'raw',
                        // inline: true,
                        // autoresize_on_init: true,
                        skin: 'enboarder',
                        noneditable_regexp: /\{\{[\w-# \/\.\*\,\(\)\'\\\&:\u00C0-\u024F\u1E00-\u1EFF]+\}\}/g,
                        noneditable_noneditable_class: 'dytoken',
                        statusbar: false,
                        elementpath: false,
                        resizehandle: false,
                        preview_styles: false,
                        menubar: false,
                        default_link_target: '_blank',
                        link_title: false,
                        target_list: false,
                        browser_spellcheck: true,
                        // height: 400,
                        toolbar:
                            'styleselect | ' +
                            (fontEnabled === 'yes' ? 'fontselect |' : '') +
                            ' insertText jsonButton | bold italic forecolor alignleft aligncenter bullist numlist link',
                        oninit: 'setPlainText',
                        // plugins: ['charactercount autoresize advlist lists link anchor placeholder paste','noneditable'],
                        plugins: [
                            'charactercount autoresize advlist lists link anchor placeholder paste textcolor',
                            'noneditable'
                        ],
                        // plugins: ['print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern','noneditable'],
                        placeholder_attrs: {
                            style: {
                                cursor: 'text',
                                position: 'absolute',
                                top: '15px',
                                left: '-7px',
                                color: '#ff005b',
                                padding: '1%',
                                width: '98%',
                                overflow: 'hidden',
                                'white-space': 'pre-wrap',
                                'font-size': '18px'
                            }
                        },
                        advlist_bullet_styles: 'default',
                        advlist_number_styles: 'default',
                        style_formats: [
                            { title: 'Small', format: 'h6' },
                            { title: 'Default', format: 'p' },
                            { title: 'Medium', format: 'h4' },
                            { title: 'Large', format: 'h2' }
                        ],
                        setup: function(editor) {
                            editor.on('focus', function(e) {
                                var edt = $('.editor');
                                if (
                                    !edt.is(e.target) &&
                                    edt.has(e.target).length === 0
                                ) {
                                    edt.removeClass('focus');
                                }
                                $('#' + e.target.id)
                                    .closest('.editor')
                                    .addClass('focus');
                                $('#' + e.target.id)
                                    .closest('.close-enabled-sms')
                                    .addClass('focus');
                                $('#' + e.target.id)
                                    .closest('.close-enabled')
                                    .addClass('focus');
                            });
                            if (!comm) {
                                editor.on('click', function(e) {
                                    $('.close-enabled').removeClass('focus');
                                });
                            }

                            var menuItems = [];
                            menuItems.push(
                                service.getOptionsFieldsMenu(
                                    'Names',
                                    editor,
                                    dropdownOptions,
                                    employeeLabel,
                                    prflFieldOptions
                                )
                            );
                            if (catdropdown && _.size(catdropdown) > 0) {
                                menuItems.push(
                                    service.getOptionsFieldsMenu(
                                        'Categories',
                                        editor,
                                        catdropdown
                                    )
                                );
                            }

                            if (cfOptions && _.size(cfOptions) > 0) {
                                menuItems.push(
                                    service.getOptionsFieldsMenu(
                                        'Custom fields',
                                        editor,
                                        cfOptions
                                    )
                                );
                            }
                            if (formDropdownOptions.length > 0) {
                                menuItems.push(
                                    service.getFormOptionsFieldsMenu(
                                        'Forms',
                                        editor,
                                        formDropdownOptions
                                    )
                                );
                            }
                            if (ackOptions && _.size(ackOptions) > 0) {
                                menuItems.push(
                                    service.getOptionsFieldsMenu(
                                        'Acknowledge',
                                        editor,
                                        ackOptions
                                    )
                                );
                            }
                            if (
                                videorecOptions &&
                                _.size(videorecOptions) > 0
                            ) {
                                menuItems.push(
                                    service.getOptionsFieldsMenu(
                                        'Video Recording',
                                        editor,
                                        videorecOptions
                                    )
                                );
                            }
                            menuItems.push({
                                text: 'Start date',
                                onclick: function() {
                                    editor.insertContent('{{newhire_startdt}}');
                                }
                            });

                            editor.addButton('insertText', {
                                text: 'Insert text',
                                type: 'menubutton',
                                icon: 'dynamic-text',
                                menu: menuItems
                            });

                            if (btnParams) {
                                editor.addButton(btnParams.btnName, {
                                    text: btnParams.btnLabel,
                                    icon: false,
                                    onclick: function() {
                                        editor.insertContent(
                                            btnParams.methodName
                                        );
                                    }
                                });
                            }
                        }
                    };
                    console.log(
                        'inside TinyMCE fontOptions ========== ',
                        fontOptions
                    );
                    if (fontEnabled === 'yes') {
                        let formats = fontOptions.fonts.reduce(
                            (fmt, fontopt) => {
                                if (fontopt.sel === 'yes') {
                                    return (fmt +=
                                        fontopt.nm + '=' + fontopt.nm + ';');
                                }
                                return fmt;
                            },
                            ''
                        );
                        // add the enboarder default to the options
                        formats =
                            'Enboarder default=Open Sans,sans-serif;' + formats;
                        tinymceOpt.font_formats = formats;
                        tinymceOpt.content_css = [fontOptions.url];
                    }
                    return tinymceOpt;
                },
                setLockState: function(val) {
                    lockState = val;
                },
                getLockState: function() {
                    return lockState;
                }
            };
        }
    ]).name;

export default workflowService;
