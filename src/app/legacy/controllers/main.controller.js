mainController.$inject = [
  '$cookies',
  '$http',
  '$location',
  '$mdDialog',
  '$rootScope',
  '$sce',
  '$scope',
  'csrAcctHierarchyService',
  'CSRCustThemeService',
  'CustCompany',
  'CustLabels',
  'serverurl'
];
function mainController(
  $cookies,
  $http,
  $location,
  $mdDialog,
  $rootScope,
  $sce,
  $scope,
  csrAcctHierarchyService,
  CSRCustThemeService,
  CustCompany,
  CustLabels,
  serverurl
) {
  console.log('Loaded EnboarderApp.controllers...', $location);

  // For lumesse brand logo
  if ($location.path() === '/lumesse') {
    $scope.lumlogo = 'yes';
  }

  $scope.showSideBar = $location.path() === '/workflow';

  $scope.model = {};
  $scope.model.telnr = '';

  $scope.padLeft = 0;
  $scope.padRight = 0;

  // API to check if a user can access the given resource
  // This is governed by the role defination and if value is configured in the role in configuration
  // It reads the configuration of this name and checks if configuration is present in the array (or it is allowed for ALL)
  $scope.canAccess = function(name, value) {
    var canAccess = false;
    if ($rootScope.userdata && $rootScope.userdata.profile) {
      var config = $rootScope.userdata.profile[name];
      if (config) {
        if (!value) {
          // when we need to determine the root access, we will pass value as null and name as the root tag
          // e.g. to deermine report nav1 access, if user has any report access then nav1 report menu needs to be shown
          canAccess = true;
          // } else if(config[0] === 'ALL' || config.includes(value)){
        } else if (config[0] === 'ALL' || _.includes(config, value)) {
          canAccess = true;
        }
      }
    }
    return canAccess;
  };

  // Checks if user has permission to specific Action
  // Name can be dot notation JSON path in the profile configuration
  // API returns true of value of the permission is 'yes', false otherwise
  $scope.hasPermission = function(name) {
    var hasPermission = false;
    if ($rootScope.userdata && $rootScope.userdata.profile) {
      var item = $rootScope.userdata.profile;
      var pathArr = name.split('.');
      pathArr.forEach(function(path) {
        item = item[path];
        if (!item) {
          return; // break, item not found
        }
      });
      if (item && item.toUpperCase() === 'YES') {
        hasPermission = true;
      }
    }
    return hasPermission;
  };

  if (
    $location.absUrl().indexOf('dev.enboarder.com') != -1 ||
    $location.absUrl().indexOf('dev.enboarder.net') != -1
  ) {
    $scope.favicon = $sce.trustAsResourceUrl(
      '//static.enboarder.net/images/devfavicon.png'
    );
  } else if (
    $location.absUrl().indexOf('test.enboarder.com') != -1 ||
    $location.absUrl().indexOf('test.enboarder.net') != -1
  ) {
    $scope.favicon = $sce.trustAsResourceUrl(
      '//static.enboarder.net/images/testfavicon.png'
    );
  } else {
    $scope.favicon = $sce.trustAsResourceUrl(
      '//static.enboarder.net/images/prodfavicon.png'
    );
    // $scope.favicon = 'testfavicon.png';
  }

  // In Safari, some dialogs are showing mirror image state
  // So to prevent that, we are adding/removing 1px scroll which fixes that
  $('body').on('click', '*[role=button], *[type=button]', function(e) {
    setTimeout(function(e) {
      if (angular.element(document).find('md-dialog').length > 0) {
        $('md-dialog').css('margin-bottom', '1px');
        $('md-dialog').scrollTop(1);
        $('md-dialog').css('margin-bottom', '0');
      }

      // For audit log
      $('.main').css('margin-bottom', '1px');
      $('.main').scrollTop(1);
      $('.main').css('margin-bottom', '0');
    }, 300);
  });

  // Server side error for SMS send
  // $("body").on("click", ".send-sms-btn", function (e) {
  //   $(".sms-form").addClass("success");
  // });

  // Refresh fresh desk iframe everytime help icon in menu is clicked
  $('body').on('click', '.helpbtn', function(e) {
    $('.fresh-desk').attr('src', $('.fresh-desk').attr('src'));
  });

  // Dashboard level 3 scroll Logic
  $('body').on('click', '.dash3-text.more-action', function(e) {
    e.stopPropagation();
    e.preventDefault();

    var totalWidth = $('.dashlvl-3').innerWidth();
    var screenCenter = (totalWidth / 2).toFixed(0);

    // console.log( + ' , ' + e.pageY);
    // var clickX = e.pageX;

    var shiftDiff = e.pageX - screenCenter;
    // console.log('Actual Click [%s]  Shift Diff [%s], direction [%s] Screen Center  ::: [%s] ',e.pageX, shiftDiff, shiftDiff < 0 ? 'Right' : 'Left', screenCenter);
    console.log(
      'Actual Click [%s]  Shift Diff [%s], Pad ( left : %s, Right :%s) Screen Center  ::: [%s] ',
      e.pageX,
      shiftDiff,
      $scope.padLeft,
      $scope.padRight,
      screenCenter
    );

    if (Math.abs(shiftDiff) < 40) {
      console.log('No Visible Change, No Shiting.....');
      return;
    }

    // clickX = clickX - $scope.padRight - $scope.padLeft;
    // console.log('Computed Clickx [%s], Pad Right [%s], Pad Left [%s]',e.pageX,$scope.padRight , $scope.padLeft);

    if (e.pageX > screenCenter) {
      //This means we are on the right side of the page, move left to go to center
      var rightPadNeeded = e.pageX - screenCenter;
      // rightPadNeeded =  rightPadNeeded + $scope.padRight;
      console.log(
        'rightPadNeeded  from screen center [%s] and after addition [%s]',
        rightPadNeeded - $scope.padRight,
        rightPadNeeded
      );
      if ($scope.padLeft > rightPadNeeded) {
        $scope.padLeft = $scope.padLeft - rightPadNeeded;
        $scope.padRight = 0;
      } else {
        $scope.padRight = rightPadNeeded - $scope.padLeft;
        $scope.padLeft = 0;
      }
      console.log(
        'Slide Left :::  ( Left Padding : %s, Right Padding: %s)',
        $scope.padLeft,
        $scope.padRight
      );

      $('.main-table-in').css('padding-right', $scope.padRight + 'px');
      $('.main-table-in').css('padding-left', $scope.padLeft + 'px');

      $('.linemain').css('padding-left', $scope.padRight + 530 + 'px');
      $('.linemain').css('padding-right', $scope.padLeft + 'px');

      var leftPos = $('.dashlvl-3').scrollLeft();
      // console.log('Left Shifted Amount [%s]:: Padding-right [%s] Removed padding-left, computed Left [%s]',shift, shiftpx, leftPos);
      // $('.dashlvl-3').animate({scrollLeft: leftPos + shift}, 500);
      $('.dashlvl-3').animate({ scrollLeft: $scope.padRight + leftPos }, 0);
      // $('.dashlvl-3').animate({scrollLeft: leftPos}, 500);
    } else if (e.pageX < screenCenter) {
      //This means we are on the right side of the page, move left to go to center
      var leftPadNeeded = screenCenter - e.pageX;
      // leftPadNeeded =  leftPadNeeded + $scope.padLeft;

      if ($scope.padRight > leftPadNeeded) {
        $scope.padRight = $scope.padRight - leftPadNeeded;
        $scope.padLeft = 0;
      } else {
        $scope.padLeft = leftPadNeeded - $scope.padRight;
        $scope.padRight = 0;
      }

      $('.main-table-in').css('padding-right', $scope.padRight + 'px');
      $('.main-table-in').css('padding-left', $scope.padLeft + 'px');

      $('.linemain').css('padding-left', $scope.padRight + 530 + 'px');
      $('.linemain').css('padding-right', $scope.padLeft + 'px');

      console.log(
        'Slide Right :::  ( LeftPad : %s, RightPad : %s)',
        $scope.padLeft,
        $scope.padRight
      );
      var rightPos = $('.dashlvl-3').scrollLeft();

      // console.log('Right Shifted Amount [%s]:: Padding-left [%s] Removed padding-right; computed Right [%s]',leftPad, leftPadpx, rightPos);
      // $('.dashlvl-3').animate({scrollLeft: rightPos + leftPad}, 500);
      var negativePad = -1 * $scope.padLeft;
      $('.dashlvl-3').animate({ scrollLeft: negativePad + rightPos }, 0);
      // $('.dashlvl-3').animate({scrollLeft: rightPos}, 500);
    }
  });

  // Show/hide
  $('body').on('click', '.show-hide', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var showhide = $(this).closest('.show-hide');

    $(this)
      .next('.detail-section')
      .slideToggle(10);

    $('.arrow-toggle', showhide).toggleClass('icon-arrow-2');
    $('.arrow-toggle', showhide).toggleClass('icon-arrow-1');
    // $(this).next(".detail-section").toggleClass('expanded', 1000);

    // var thisParent = $(this).parent();
    // $(this).closest('.history_record_container').find('.history_record_body').slideDown('slow',function() {
    //   $(thisParent).toggleClass('squared_bottom');
    // });
    // $(this).parent().siblings().children().next().stop(true, true).delay(100).hide(200);
    // $('.folder-toggle', showhide).toggleClass('icon-folder-open');
    // $('.folder-toggle', showhide).toggleClass('icon-folder-closed');
  });

  // For WF level 2 sidenav
  $('body').on('click', '.show-hide-wfl2', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var showhide = $(this).closest('.show-hide-wfl2');
    var detailsec = $(this).closest('.detail-section');
    var arrowtoggle = $(this).closest('.show-hide-wfl2 .arrow-toggle');

    $(this)
      .next('.detail-section')
      .toggleClass('show');

    if ($(detailsec).hasClass('show')) {
      $('.folder-toggle', showhide).toggleClass('icon-folder-open');
    } else {
      $('.folder-toggle', showhide).toggleClass('icon-folder-open');
      $('.folder-toggle', showhide).toggleClass('icon-folder-closed');
    }

    if ($(arrowtoggle).hasClass('icon-arrow-2')) {
      $('.arrow-toggle', showhide).toggleClass('icon-arrow-2');
    } else {
      $('.arrow-toggle', showhide).toggleClass('icon-arrow-3');
    }
  });

  // For toggle table rows in Dashboard level 3
  $('body').on('click', '.show-hide-dashboard', function(e) {
    e.stopPropagation();
    // e.preventDefault();
    var showhide = $(this).closest('.show-hide-dashboard');

    $(this)
      .closest('.collapse-wrap')
      .find('.detail-section-dashboard')
      .toggleClass('show-row');

    $('.arrow-toggle', showhide).toggleClass('icon-arrow-2');
    $('.arrow-toggle', showhide).toggleClass('icon-arrow-3');
  });
  $('body').on('click', '.status-logic', function(e) {
    e.stopImmediatePropagation();
  });

  // For load data modal
  $('body').on('click', '.logicotr', function(e) {
    e.stopPropagation();
    var showhide = $(this).closest('.logicotr');
    $(this)
      .closest('.collapse-wrap')
      .find('.logicin')
      .toggleClass('show-row');
    $('.arrow-toggle', showhide).toggleClass('icon-arrow-2');
    $('.arrow-toggle', showhide).toggleClass('icon-arrow-3');
  });

  // popover action
  function closeAllother() {
    $(document).mouseup(function(e) {
      e.stopPropagation();
      e.preventDefault();

      var container = $(
        '.action-popover, .preivew-popover, .action-popover-mobile, .list-wrap, .action-dblpop, .prfcom-dd'
      );

      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
        $('.info-text').removeClass('opt');
        $('.boxht').removeClass('opt');
      }

      $('.mm-dropdown').removeClass('hover');
    });
  }
  $('body').on('click', '.more-action', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .parent()
      .find('.action-popover')
      .stop(true, true)
      .delay(100)
      .show();
    $(this)
      .parent()
      .find('.preivew-popover')
      .stop(true, true)
      .delay(100)
      .show();
    $('.action-popover').removeClass('popopen');
    $('.info-text').removeClass('opt');
    $('.boxht').removeClass('opt');
    $(this)
      .closest('.info-text')
      .addClass('opt');
    $(this)
      .parent('.box-wrap')
      .children('.boxht')
      .addClass('opt');
    closeAllother();
  });
  $('body').on('click', '.more-action-dbl', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .parent()
      .find('.action-dblpop')
      .stop(true, true)
      .delay(100)
      .show();
    $(this)
      .closest('.info-text')
      .addClass('opt');
    closeAllother();
  });
  $('body').on('click', '.more-action-dbl-prfl', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .parent()
      .find('.action-dblpop-prfl')
      .stop(true, true)
      .delay(100)
      .show();
    closeAllother();
  });
  $('body').on('click', '.more-action-mobile', function(e) {
    $('.mobile-number-seq').intlTelInput();
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .parent()
      .find('.action-popover-mobile')
      .stop(true, true)
      .delay(100)
      .show();
    closeAllother();
  });
  $('body').on(
    'click',
    '.close-popover, .close-popover-btn, .close-popover-dbl',
    function(e) {
      e.stopPropagation();
      e.preventDefault();
      $(this)
        .closest('.info-text')
        .addClass('opt');
      $(this)
        .parent()
        .stop(true, true)
        .delay(100)
        .hide();
    }
  );
  $('body').on('click', '.close-profilepopover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .closest('.action-popover')
      .stop(true, true)
      .delay(100)
      .hide();
  });

  // Opening custom dropdown on click
  $('body').on('click', '.mm-dropdown', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .parent()
      .find('.list-wrap')
      .stop(true, true)
      .delay(100)
      .show();
    $(this).addClass('hover');
    closeAllother();
  });

  // for logic tile show hide on level 3
  $('body').on('click', '.text-tile-wrap-outer', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(this)
      .closest('li.active')
      .find('.text-tile-wrap-outer')
      .toggleClass('show');
  });

  // Scroll table button
  $('body').on('click', '.scroll-btn-wrap', function(e) {
    var leftPos = $('.table-wrapper').scrollLeft();
    $('.table-wrapper').animate({ scrollLeft: leftPos + 250 }, 400);
    $('.scroll-btn-wrap-rt').show();
  });
  $('body').on('click', '.scroll-btn-wrap-rt', function(e) {
    var leftPos = $('.table-wrapper').scrollLeft();
    $('.table-wrapper').animate({ scrollLeft: leftPos - 250 }, 400);
  });

  // disable mousewheel on a input number field when in focus
  // (to prevent Cromium browsers change the value when scrolling)
  $('body').on('focus', 'input[type=number]', function(e) {
    $(this).on('mousewheel.disableScroll', function(e) {
      e.preventDefault();
    });
  });
  $('body').on('blur', 'input[type=number]', function(e) {
    $(this).off('mousewheel.disableScroll');
  });

  // To detect horizontal scroll bar anywhere
  $.fn.hasHorizontalScrollBar = function() {
    return this.get(0) ? this.get(0).scrollWidth > this.innerWidth() : false;
  };

  // MM menu screen width
  function addClasEdge() {
    $('.list-wrap li').on('mouseenter mouseleave', function(e) {
      if ($('ul', this).length) {
        var off = $('ul .list-wrap-inner', this).offset();
        if (off) {
          var t = off.top;
          var l = off.left;
          var h = $(this).height();
          var w = $(this).width();
          var docH = $(window).height();
          var docW = $(window).width();

          var isEntirelyVisible =
            t > 0 && l > 0 && t + h < docH && l + w < docW;
          if (!isEntirelyVisible) {
            $('.list-wrap-inner li > .list-wrap-inner').addClass('edge');
          } else {
            $('.list-wrap-inner li > .list-wrap-inner').removeClass('edge');
          }
        }
      }
    });
  }
  $(window).resize(function() {
    addClasEdge();

    // Show/hode scroll table button
    if ($('.table-wrapper').hasHorizontalScrollBar()) {
      $('.scroll-btn-wrap').addClass('showarr');
    } else {
      $('.scroll-btn-wrap').removeClass('showarr');
    }
  });
  $(window).load(function() {
    // Show/hode scroll table button
    if ($('.table-wrapper').hasHorizontalScrollBar()) {
      $('.scroll-btn-wrap').addClass('showarr');
    } else {
      $('.scroll-btn-wrap').removeClass('showarr');
    }
  });
  $(document).mouseup(function(e) {
    e.stopPropagation();
    e.preventDefault();

    addClasEdge();
  });

  // Background Image
  if ($cookies.get('ltok')) {
    var configItem = CustCompany.get({ userdata: 'yes' }, function() {
      CustLabels.setCustomLabels(configItem.custlabels);
      $scope.gradient = 'theme-gradient-red';
      $scope.backgroundImg = '//static.enboarder.net/images/enboarder-bg.jpg';
      if (configItem.ischild === 'yes' && $cookies.get('s_u')) {
        $scope.showSigninAs = true;
        $scope.compname = $cookies.get('s_u');
      }
      if (configItem.attr) {
        $scope.gradient = configItem.attr.overlay;
        $scope.backgroundImg = configItem.attr.bgimage;
        $scope.backgroundImgCdn = configItem.attr.bgimageCdn;
        if (typeof $scope.sendescalate === 'undefined') {
          $scope.sendescalate = true;
        } else {
          $scope.sendescalate = configItem.attr.sendescalate;
        }
        $scope.sendreminder = configItem.attr.sendreminder;

        $scope.escalationemail = configItem.escalationemail;
        $scope.induction = configItem.attr.induction;
        $scope.notifyTime = configItem.attr.notifyTime;
        $scope.notifyTimeZone = configItem.attr.notifyTimeZone;
        $scope.notifyDays = configItem.attr.notifyDays;
        $scope.escalation = configItem.attr.escalation;
        if (configItem.isparent === 'yes') {
          csrAcctHierarchyService.setAccountHierarchy(
            configItem,
            configItem.isparent,
            configItem.maxchildaccts
          );
        } else {
          csrAcctHierarchyService.setAccountHierarchy(null, false, 0);
        }
        // customised logo for refresh
        $rootScope.adminappbubble =
          (configItem.adminappbubble ||
            '//static.enboarder.net/images/logo.gif') +
          '?' +
          new Date().getTime();

        $rootScope.userdata = {
          email: configItem.userdata.username,
          name: configItem.userdata.Name,
          company: configItem.userdata.compname,
          role: configItem.userdata.role,
          appversion: configItem.userdata.appversion,
          enblbulkcsv: configItem.userdata.enblbulkcsv,
          is_sb: configItem.userdata.is_sb,
          linked_comp: configItem.userdata.linked_comp,
          prevjobrunid: configItem.userdata.prevjobrunid,
          prevjobruntime: configItem.userdata.prevjobruntime,
          profile: configItem.userdata.profile,
          photo_l: configItem.userdata.photo_l,
          reactui: configItem.reactui,
          custlabels: configItem.custlabels
        };
        console.log(
          'user data on Refresh page --1 is ::::::  ' +
            JSON.stringify($rootScope.userdata)
        );
      } else {
        //it can be case of user check and config data not returned.
        if (configItem.token) {
          //resend the request
          configItem = CustCompany.get({ userdata: 'yes' }, function() {
            if (configItem.attr) {
              $scope.gradient = configItem.attr.overlay;
              $scope.backgroundImg = configItem.attr.bgimage;
              $scope.backgroundImgCdn = configItem.attr.bgimageCdn;
              if (typeof configItem.attr.sendescalate === 'undefined') {
                $scope.sendescalate = true;
              } else {
                $scope.sendescalate = configItem.attr.sendescalate;
              }
              $scope.sendreminder = configItem.attr.sendreminder;
              $scope.escalationemail = configItem.escalationemail;
              $scope.induction = configItem.attr.induction;
              $scope.notifyTime = configItem.attr.notifyTime;
              $scope.notifyTimeZone = configItem.attr.notifyTimeZone;
              $scope.notifyDays = configItem.attr.notifyDays;
              $scope.escalation = configItem.attr.escalation;
              if (configItem.isparent === 'yes') {
                csrAcctHierarchyService.setAccountHierarchy(
                  configItem,
                  configItem.isparent,
                  configItem.maxchildaccts
                );
              } else {
                csrAcctHierarchyService.setAccountHierarchy(null, false, 0);
              }

              $rootScope.userdata = {
                email: configItem.userdata.username,
                name: configItem.userdata.Name,
                company: configItem.userdata.compname,
                role: configItem.userdata.role,
                appversion: configItem.userdata.appversion,
                enblbulkcsv: configItem.userdata.enblbulkcsv,
                is_sb: configItem.userdata.is_sb,
                linked_comp: configItem.userdata.linked_comp,
                prevjobrunid: configItem.userdata.prevjobrunid,
                prevjobruntime: configItem.userdata.prevjobruntime,
                profile: configItem.userdata.profile,
                reactui: configItem.reactui,
                custlabels: configItem.custlabels
              };
              console.log(
                'user data on Refresh page --2 is ::::::  ' +
                  JSON.stringify($rootScope.userdata)
              );
            }
          });
        }
      }
      // Intercom setup for logged in admin user
      // window.intercomSettings = {
      //     app_id: configItem.userdata.intercomAppId,
      //     name: configItem.userdata.Name, // Full name
      //     email: configItem.userdata.username, // Email address
      //     user_hash: configItem.userdata.intercomHash
      // };
      Intercom('boot', {
        app_id: configItem.userdata.intercomAppId,
        name: configItem.userdata.Name, // Full name
        user_id: configItem.userdata.username,
        email: configItem.userdata.username, // Email address
        user_hash: configItem.userdata.intercomHash,
        company: configItem.userdata.compname,
        avatar: {
          type: 'avatar',
          image_url: configItem.userdata.photo_l
        }
      });
      $scope.intercomHelpCenterUrl = configItem.userdata.intercomHelpCenterUrl;
      console.log('Intercom settings loaded for logged in user');
    });
  }
  if ($cookies.get('a_u') && $cookies.get('s_u')) {
    $scope.showSigninAs = true;
    $scope.compname = $cookies.get('s_u');
  }

  $rootScope.$on('event:parentChange', () => {
    $scope.isparent = csrAcctHierarchyService.isParentAccount();
    $scope.parentAcct = csrAcctHierarchyService.getParentAccount();
    $scope.maxchildaccts = csrAcctHierarchyService.getMaxChildAccounts();
  });

  $rootScope.$on('event:custtheme', function() {
    $scope.gradient = CSRCustThemeService.getCustTheme().overlay;
    $scope.backgroundImg = CSRCustThemeService.getCustTheme().bgimage;
    $scope.backgroundImgCdn = CSRCustThemeService.getCustTheme().bgimageCdn;
    $scope.sendescalate = CSRCustThemeService.getCustTheme().sendescalate;
    $scope.sendreminder = CSRCustThemeService.getCustTheme().sendreminder;
    $scope.escalationemail = CSRCustThemeService.getCustTheme().escalationemail;
    $scope.induction = CSRCustThemeService.getCustTheme().induction;
    $scope.notifyTime = CSRCustThemeService.getCustTheme().notifyTime;
    $scope.notifyTimeZone = CSRCustThemeService.getCustTheme().notifyTimeZone;
    //$scope.notifyDays = CSRCustThemeService.getCustTheme().notifyDays;
    $scope.escalation = CSRCustThemeService.getCustTheme().escalation;

    if (!$rootScope.userdata) {
      $rootScope.userdata = {};
    }
    $rootScope.userdata.enblbulkcsv = CSRCustThemeService.getCustTheme().enblbulkcsv;

    $rootScope.userdata.is_sb = CSRCustThemeService.getCustTheme().is_sb;
    $rootScope.userdata.linked_comp = CSRCustThemeService.getCustTheme().linked_comp;
    $rootScope.userdata.prevjobrunid = CSRCustThemeService.getCustTheme().prevjobrunid;
    $rootScope.userdata.prevjobruntime = CSRCustThemeService.getCustTheme().prevjobruntime;
    $rootScope.userdata.reactui = CSRCustThemeService.getCustTheme().reactui;

    if (typeof $scope.sendescalate === 'undefined') {
      $scope.sendescalate = true;
    }

    $scope.showSigninAs = CSRCustThemeService.getShowSigninAs();
    $scope.compname = CSRCustThemeService.getCompanyName();
  });

  $scope.returnToCSR = function() {
    $location.path('/csr/complist');
  };
  $scope.gotoLogin = function() {
    $location.path('/login');
  };

  $scope.showIntercomBtn = 'yes';
  $scope.showIntercom = function() {
    Intercom('show');
    $scope.showIntercomBtn = 'no';
  };

  $scope.hideIntercom = function() {
    Intercom('hide');
    $scope.showIntercomBtn = 'yes';
  };

  $scope.switchTo = function(compkey) {
    console.info('switchTo called with compkey %s', compkey);
    $http.post(serverurl + 'sandbox/switchto/' + compkey).then(
      function onSuccess(response) {
        var data = response.data;
        console.info('**Message from Server >>>>' + JSON.stringify(data));
        //Navigate to Workflow Admin menu
        if (data.showSigninAs === 'Y') {
          CSRCustThemeService.setCustTheme(data, true, data.compname);
        } else {
          $rootScope.userdata.company = data.compname;
          $rootScope.userdata.enblbulkcsv = data.enblbulkcsv;
          $rootScope.userdata.is_sb = data.is_sb;
          $rootScope.userdata.linked_comp = data.linked_comp;
          $rootScope.userdata.prevjobrunid = data.prevjobrunid;
          $rootScope.userdata.prevjobruntime = data.prevjobruntime;
          $scope.sendescalate = data.sendescalate;
          $scope.sendreminder = data.sendreminder;
        }
        if (data.isparent === 'yes') {
          csrAcctHierarchyService.setAccountHierarchy(
            data,
            data.isparent,
            data.maxchildaccts
          );
        } else {
          csrAcctHierarchyService.setAccountHierarchy(null, false, 0);
        }
        $scope.compname = data.compname;
        $location.path('/workflow');
        window.location.reload();
      },
      function onError(error) {
        console.info('Error from Server >>>>' + error);
      }
    );
  };

  var progressPinger = null;
  // pings job progress status
  function updateProgress(jobid) {
    var postData = {};
    postData['jobid'] = jobid;
    $http.post(serverurl + 'sandbox/jobstatus', postData).then(
      function onSuccess(response) {
        var data = response.data;
        //console.log('jobstatus data is :::: '+JSON.stringify(data));
        $rootScope.taskstage = data.status;
        if (data.status === 'five') {
          if (progressPinger) {
            clearInterval(progressPinger);
          }
          $rootScope.taskinprogress = 'N';
        }
      },
      function onError(response) {}
    );
  }

  // refresh sandbox from production
  $scope.refreshSandbox = function() {
    $rootScope.taskinprogress = 'Y';
    $rootScope.taskstage = 'one';
    $rootScope.taskName = 'Refreshing Sandbox';
    var postData = {};
    if ($rootScope.userdata.is_sb === 'Y') {
      postData['prod_ckey'] = $rootScope.userdata.linked_comp;
    } else {
      postData['sb_ckey'] = $rootScope.userdata.linked_comp;
    }
    $http.post(serverurl + 'sandbox/refresh', postData).then(
      function onSuccess(response) {
        var data = response.data;
        console.log('refresh data is :::: ' + JSON.stringify(data));
        progressPinger = setInterval(updateProgress, 5000, data.jobid);
      },
      function onError(response) {}
    );
  };
  // promote sandbox data to live
  $scope.promoteSandboxToLive = function() {
    $rootScope.taskinprogress = 'Y';
    $rootScope.taskstage = 'one';
    $rootScope.taskName = 'Promoting Sandbox';
    var postData = {};
    if ($rootScope.userdata.is_sb === 'Y') {
      postData['prod_ckey'] = $rootScope.userdata.linked_comp;
    } else {
      postData['sb_ckey'] = $rootScope.userdata.linked_comp;
    }
    $http.post(serverurl + 'sandbox/prodpush', postData).then(
      function onSuccess(response) {
        var data = response.data;
        console.log('prodpush data is :::: ' + JSON.stringify(data));

        progressPinger = setInterval(updateProgress, 5000, data.jobid);
      },
      function onError(response) {
        $rootScope.taskinprogress = 'N';
      }
    );
  };

  // revert live org data to it's last state
  $scope.revertLiveToPrevious = function(prevprodpushid, prevjobruntime) {
    console.log(
      '>>> prevprodpushid [%j] ran at [%j]',
      prevprodpushid,
      prevjobruntime
    );
    var sb_ckey;
    if (!$rootScope.userdata.is_sb || $rootScope.userdata.is_sb === 'N') {
      sb_ckey = $rootScope.userdata.linked_comp;
    }

    $mdDialog
      .show({
        controller: revertModalController,
        templateUrl: 'views/csr/modal-revert-sbox.html',
        parent: angular.element(document.body),
        locals: {
          prevjobrunid: prevprodpushid,
          prevjobruntime: prevjobruntime,
          sb_ckey: sb_ckey
        },
        clickOutsideToClose: false
      })
      .then(function(answer) {}, function() {});
  };

  revertModalController.$inject = [
    '$scope',
    '$mdDialog',
    'prevjobrunid',
    'prevjobruntime',
    'sb_ckey'
  ];
  function revertModalController(
    $scope,
    $mdDialog,
    prevjobrunid,
    prevjobruntime,
    sb_ckey
  ) {
    $scope.prevjobrunid = prevjobrunid;
    $scope.prevjobruntime = prevjobruntime;

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.revert = function() {
      console.log('This will revert ::::::');
      $rootScope.taskinprogress = 'Y';
      $rootScope.taskstage = 'one';
      $rootScope.taskName = 'Revert Live To Previous';
      var postData = {};
      if (sb_ckey) {
        postData['sb_ckey'] = sb_ckey;
      }
      postData['prevjobrun'] = prevjobrunid;
      $http.post(serverurl + 'sandbox/revertprod', postData).then(
        function onSuccess(response) {
          var data = response.data;
          console.log('revertprod data is :::: ' + JSON.stringify(data));
          progressPinger = setInterval(updateProgress, 5000, data.jobid);
          $mdDialog.hide();
        },
        function onError(response) {}
      );
    };
  }

  $scope.selectedItems = {
    quote: {
      label: 'You ngModal now works'
    }
  };

  console.log('Intercom load js file https://widget.intercom.io/widget/');
  (function() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      var d = document;
      var i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function() {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/';
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  })();
}

export default mainController;
