var inqcontroller = angular.module('inqcontroller', ['templateservicemod', 'navigationservice']);

var adminurl = "http://localhost/rest/rest/index.php/";
var imageurl = "http://localhost/rest/rest/uploads/";
//var adminurl = "http://learnwithinq.com/adminpanel/rest/index.php/";
//var imageurl = "http://learnwithinq.com/adminpanel/rest/uploads/";

var usertypes = [
    {
        id: 1,
        'type': 'teacher',
        'image': 'img/feed/teacher.svg'
        },
    {
        id: 2,
        'type': 'Inhouse',
        'image': 'img/feed/inhouse.svg'
        },
    {
        id: 3,
        'type': 'Non In-house',
        'image': 'img/feed/noninhouse.svg'
        }
    ];

inqcontroller.controller('home', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {

        $scope.template = TemplateService; // loading the TemplateService
        TemplateService.content = "views/content.html"; // setting the content of the page as content.html
        $scope.title = "Home";
        $scope.navigation = NavigationService.getnav();
        $rootScope.loginpage = false;

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        var nav = {
            location: "/home",
            title: "INQ",
            position: 0,
            clickable: true
        };
        $rootScope.navigation = $.jStorage.get("navigation");
        $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
            return n.position < nav.position;
        });
        $rootScope.navigation[nav.position] = nav;
        $.jStorage.set("navigation", $rootScope.navigation);
        /*SET NAVIGATION END*/

        /*function*/

        // routing

  }]);

inqcontroller.controller('loginCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.title = "Login";

        //INITIALIZATIONS
        $scope.error = false;
        $scope.logindata = {
            contact: "",
            password: ""
        };

        $rootScope.showmenu = false;

        var loginsuccess = function (response) {
            if (response.data == 'false') { // if login fails i.e. no data received
                console.log('Login error');
                $scope.error = true;
            } else {
                $scope.error = false;
                console.log(response.data);
                $.jStorage.set('user', response.data);
                $rootScope.showmenu = true;
                if ($.jStorage.get('user').access_id != 3) { // if teacher or in-house stud
                    $location.path('/subjects');
                } else { // if non in-house person
                    $location.path('/standards');
                }
            }
        };

        /*function*/
        $scope.dologin = function () {
            $scope.error = false;
            console.log($scope.logindata);
            NavigationService.dologin($scope.logindata.contact, $scope.logindata.password).then(loginsuccess); // try login and if success goto loginsuccess function
        }

        // routing

  }]);

inqcontroller.controller('standardsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.title = "Standards";
        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/standards.html";

        /*NAVIGATION SET*/
        var nav = {
            location: "/home",
            title: "INQ",
            position: 0,
            clickable: true
        };
        $rootScope.navigation = $.jStorage.get("navigation");
        $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
            return n.position < nav.position;
        });
        $rootScope.navigation[nav.position] = nav;
        $.jStorage.set("navigation", $rootScope.navigation);
        /*SET NAVIGATION END*/

        var getstandardsuccess = function (response) {
            console.log(response.data);
            $scope.standards = response.data;
            $rootScope.loadingdiv = false;
        };

        var getstandarderror = function (response) {
            console.log(response.data);
        };

        //INITIALIZATIONS
        $rootScope.loadingdiv = true;
        console.log($rootScope.loadingdiv);
        NavigationService.getstandardsbyboardid($.jStorage.get('user').board_id).then(getstandardsuccess, getstandarderror); // get the standards related to user's board_id
        $.jStorage.get("user").standard_id = 0; // setting the default when no standards are selected
        $.jStorage.get("user").standard_name = "No"; // Initially the standard will appear as no standard

        /*function*/

        // routing
        $scope.gotosubjects = function (index) {
            $.jStorage.get('user').standard_id = $scope.standards[index].id;
            var name = $scope.standards[index].name;
            $.jStorage.get('user').standard_name = name;
            $location.path('/subjects');
        };

  }]);

inqcontroller.controller('conceptcardsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$routeParams', '$sce', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $routeParams, $sce, $location) {

        $scope.title = "ConceptCards";
        $scope.template = TemplateService;
        TemplateService.content = "views/conceptcards.html";
        $rootScope.fullpageview = true;
        $scope.conceptid = $routeParams.conceptid;

        var cw = $('.cardbut').width();
        $('.cardbut').css({
            'height': cw + 'px'
        });

        $interval(function () {

            console.log("BAARAJA");

            var $el = $('#baraja-el'),
                baraja = $el.baraja();

            // navigation
            $('#nav-prev').on('click', function (event) {
                baraja.previous();
            });

            $('#nav-next').on('click', function (event) {
                console.log("NEXT");
                baraja.next();

            });

        }, 2000, 1);

        $rootScope.$watch(function () {
            var math = document.getElementById("carddata");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], math);
            return true;
        });

        //INITIALIZATIONS
        $scope.cardindex = -1; // Initially set the cardindex to -1 so if there are no cards it appeards 0/0 cards
        $scope.user = $.jStorage.get("user");


        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 4,
                clickable: false
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('concepts', $scope.conceptid).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        var getcardsuccess = function (response) {

            console.log(response.data);

            $scope.conceptcards = response.data;
            if (response.data.length > 0) { // if there is atleast 1 conceptcard then set cardindex to 0
                $scope.cardindex = 0;
            }

            _.forEach($scope.conceptcards, function (value) {
                if (value.user_id == 0) {
                    value.conceptdata = $sce.trustAsHtml(value.conceptdata);
                }
            });

            if (response.data.length > 0) {
                readcardbyuserid(0);
            }
        };

        var getcarderror = function (response) {
            console.log(response.data);
        };

        var readcardsuccess = function (response) {
            console.log(response.data);
            $scope.conceptcards[$scope.cardindex].cardread = 1;
        };

        var readcarderror = function (response) {
            console.log(response.data);
        };

        /*function*/
        NavigationService.getcardsbyconceptid($scope.conceptid, $.jStorage.get("user").id).then(getcardsuccess, getcarderror);

        var readcardbyuserid = function (cid) {
            if ($scope.conceptcards[cid].cardread == 0) {
                NavigationService.readcardbyuserid($.jStorage.get("user").id, $scope.conceptcards[cid].id).then(readcardsuccess, readcarderror);
                console.log("CALLING STATEMENT");
            }
        };

        var getconceptnamesuccess = function (response) {
            console.log(response.data);
            $scope.conceptdata = response.data;
        };

        var getconceptnameerror = function (response) {
            console.log(response.data);
        };

        NavigationService.getconceptname($scope.conceptid).then(getconceptnamesuccess, getconceptnameerror);

        // routing
        $scope.changecardindex = function (index) {
            if ($scope.conceptcards[$scope.cardindex].user_id == $scope.user.id && $scope.conceptcards[$scope.cardindex].editmode == true) {
                alert("Card not saved");
            } else if ($scope.cardindex == 0 && index == -1) {

            } else if ($scope.cardindex == $scope.conceptcards.length - 1 && index == 1) {

            } else if ($scope.cardindex >= 0 && $scope.cardindex < $scope.conceptcards.length) {
                $scope.cardindex += index; // keep changing the index, +1 for next and -1 for previous
                readcardbyuserid($scope.cardindex);
            }
        };

        $scope.addcustomusercard = function () {

            $scope.conceptcards.splice($scope.cardindex + 1, 0, { // add the card such that when we click on + the new card is added next to the current card and the index is same as current card's index
                user_id: $.jStorage.get("user").id,
                cardnumber: $scope.conceptcards[$scope.cardindex].cardnumber,
                conceptdata: "",
                editmode: true,
                concept_id: $scope.conceptid,
                id: 0
            });

            console.log($scope.conceptcards);

            /*CHANGE CARD INDEX TO +1 */
            $scope.changecardindex(1);
            /*CHANGE CARD*/
            var $el = $('#baraja-el'),
                baraja = $el.baraja();
            baraja.updateStack()
        };

        var savecustomcardssuccess = function (response) {
            console.log(response.data);
            console.log($scope.conceptcards[$scope.cardindex]);
            if (response.data != "false") {
                $scope.conceptcards[$scope.cardindex].editmode = false;

                if (response.data != "true") {
                    $scope.conceptcards[$scope.cardindex].id = response.data;
                }
            }

        };
        var savecustomcardserror = function (response) {
            console.log(response.data);
        };

        /* SAVE CUSTOM CARD */
        $scope.savecustomusercard = function (ind) {
            console.log($scope.conceptcards[ind]);
            NavigationService.savecustomcards($scope.conceptcards[ind]).then(savecustomcardssuccess, savecustomcardserror);
        };

        /* EDIT CUSTOMER CARD MODE */
        $scope.editcustomusercard = function (ind) {
            $scope.conceptcards[ind].editmode = true;
        };


        $scope.deletecustomusercard = function (ind) {
            /*ASK FOR CONFIRMATION*/
            $scope.conceptcards[ind].editmode = false;
        };

  }]);

inqcontroller.controller('testsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval) {

        $scope.title = "Tests";
        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/tests.html";

        //INITIALIZATIONS

        //STYLING
        $interval(function () {
            /* var height = $('.optiondiv').height();
             $scope.upperpadding = height / 2;*/

            /*$interval(function () {
                var upperheight = $('.upperdiv').outerHeight();
                console.log(upperheight);
                $scope.optionmargin = upperheight - 52 - (height / 2);

                console.log($scope.optionmargin);
            }, 200, 1);*/

            //$('.bottomnav').width($('.bd').width());

            /*$('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            });*/

            //$('.dropdown1').height($('.qndiv').height());

            /*TOOLTIPS FOR BUTTONS*/
            $('.tooltipped').tooltip({
                delay: 10
            });

            /*INITIALIZE MODALS*/
            $(document).ready(function () {
                // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
                $('.modal').modal();
            });

        }, 2000, 1);

        /*Design Functions*/

        /*Open Modal - ERROR REPORT OR DOUBT*/
        $scope.openmodal = function (modalname) {
            console.log("open modal");
            $(modalname).modal('open');
        };

        /*BOOKMARK QUESTION*/
        $scope.bookmarkquestion = function (id) {
            //CHECK IF BOOKMARKED OR TO REMOVE BOOKMARK
            //SET TEXT ACCORDINGLY
            var bookmarktoasttext = "This Question has been Bookmarked !"
            /*ON SUCCESS OF BOOKMARKING*/
            var $toastContent = $('<span>' + bookmarktoasttext + '</span>').add($('<button class="btn-flat toast-action" ng-click="bookmarkquestion()">Undo</button>'));
            Materialize.toast($toastContent, 3000);
        };

        /*function*/



        // routing

  }]);

inqcontroller.controller('conceptsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.title = "Concepts";
        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/concepts.html";
        $scope.chapterid = $routeParams.chapterid;

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        console.log($rootScope.navigation);
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 3,
                clickable: true
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('chapters', $scope.chapterid).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        /*FETCH CONCEPTS BY CHAPTER ID*/
        var getconceptsbychapteridsuccess = function (response) {

            $scope.concepts = response.data;
            $rootScope.loadingdiv = false;
            console.log(response.data);

            //STYLING
            var stylepage = function () {
                var height = $('.conceptdiv').height();
                height = height / 2;
                $scope.negativemargin = height;
            };

            var style = $interval(function () {
                console.log("TRYING");
                if ($('.conceptdiv').height() == 0) {

                } else {
                    stylepage();
                    $interval.cancel(style);
                };
            }, 50, 0);
        };

        var getconceptsbychapteriderror = function (response) {
            console.log(response.data);
        };

        $rootScope.loadingdiv = true;
        NavigationService.getconceptsbychapterid($.jStorage.get('user').id, $scope.chapterid).then(getconceptsbychapteridsuccess, getconceptsbychapteriderror);
        //END OF FETCHING CONCEPTS

        // routing
        $scope.gotoconceptcards = function (id) {
            $location.path('/conceptcards/' + id);
        };

  }]);

inqcontroller.controller('testresultsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {

        $scope.title = "testresults";
        $scope.template = TemplateService;
        TemplateService.content = "views/testresults.html";
        $rootScope.fullpageview = true;
        $scope.conceptwidth = 70;

        //INITIALIZATIONS

        /*function*/

        // routing

  }]);

inqcontroller.controller('subjectsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/subjects.html";
        $scope.navigation = NavigationService.getnav();

        //INITIALIZATIONS

        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 1,
                clickable: true
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('standards', $.jStorage.get('user').standard_id).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        /*GET SUBJECTS FROM USER's STANDARD ID*/
        var getsubjectsbyuseridsuccess = function (response) {
            console.log(response.data);
            $scope.subjects = response.data;
            $rootScope.loadingdiv = false;
        };

        var getsubjectsbyuseriderror = function (response) {
            console.log(response.data);
        };
        /*MAKE LOADING TRUE*/
        $rootScope.loadingdiv = true;
        NavigationService.getsubjectsbyuserid($.jStorage.get('user').standard_id).then(getsubjectsbyuseridsuccess, getsubjectsbyuseriderror);
        /*END OG FETCHING SUBJECTS*/

        /*function*/

        // routing
        $scope.gotochapters = function (subjectid) {
            $location.path('/chapters/' + subjectid);
        };

                }]);

inqcontroller.controller('chaptersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = false;
        TemplateService.content = "views/chapters.html";
        $scope.navigation = NavigationService.getnav();

        //STYLING

        //INITIALIZATIONS
        $scope.subjectid = $routeParams.subjectid;

        /*NAVIGATION SET*/
        $rootScope.navigation = $.jStorage.get("navigation");
        var getdatabyidsuccess = function (response) {
            console.log(response.data);
            var nav = {
                location: $location.path(),
                title: response.data.name,
                position: 2,
                clickable: true
            };
            $rootScope.navigation = _.remove($rootScope.navigation, function (n) {
                return n.position < nav.position;
            });
            $rootScope.navigation[nav.position] = nav;
            $.jStorage.set("navigation", $rootScope.navigation);
        };
        var getdatabyiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getdatabyid('subjects', $scope.subjectid).then(getdatabyidsuccess, getdatabyiderror);
        /*SET NAVIGATION END*/

        /*FETCH CHAPTERS FROM SUBJECT ID*/
        var getchaptersbysubjectidsuccess = function (response) {
            console.log(response.data);
            $scope.chapters = response.data;
            $rootScope.loadingdiv = false;
            //STYLING
            var stylepage = function () {
                var height = $('.chaprow').height();
                height = height / 2;
                $scope.negativemargin = height;
            };

            var style = $interval(function () {
                console.log("TRYING");
                if ($('.chaprow').height() == 0) {

                } else {
                    stylepage();
                    $interval.cancel(style);
                };
            }, 50, 0);

        };

        var getchaptersbysubjectiderror = function (response) {
            console.log(response.data);
        };

        $rootScope.loadingdiv = true;
        NavigationService.getchaptersbysubjectid($scope.subjectid).then(getchaptersbysubjectidsuccess, getchaptersbysubjectiderror);
        /*END OF FETCHING CHAPTERS*/

        /*function*/

        // routing
        $scope.gotoconcepts = function (id) {
            $location.path("/concepts/" + id);
        };

  }]);

inqcontroller.controller('profileCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/profile.html";
        $scope.navigation = NavigationService.getnav();

  }]);

inqcontroller.controller('dashboardCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/dashboard.html";
        $scope.navigation = NavigationService.getnav();

        $interval(function () {
            $(document).ready(function () {
                $('ul.tabs').tabs({
                    'swipeable': true
                });

                var ctx = document.getElementById("timeline-graph").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
                            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
                            borderWidth: 1
        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
            }]
                        }
                    }
                });

            });

            /*CHAPTERS COLLASIBLE*/
            $('.collapsible').collapsible();

        }, 2000, 1);

        /*OPEN CHAPTER TITLE TO SE CHAPTERS*/
        $scope.openchaptertitle = function (icon) {
            console.log($(icon)[0]);
            if (document.getElementById(icon).hasClass('dashboard-chapter-title-icons-rotate')) {
                document.getElementById(icon).addClass('dashboard-chapter-title-icons-rotate');
            } else {
                document.getElementById(icon).removeClass('dashboard-chapter-title-icons-rotate');
            };
        };

  }]);

inqcontroller.controller('starredCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/starred.html";
        $scope.navigation = NavigationService.getnav();

  }]);

inqcontroller.controller('leaderboardCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        $rootScope.fullpageview = true;
        TemplateService.content = "views/leaderboard.html";
        $scope.navigation = NavigationService.getnav();

  }]);

inqcontroller.controller('menuCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
 function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {



        $scope.template = TemplateService;

        /*INITIALIZATIONS*/
        $scope.user = $.jStorage.get("user");

        /*ROOTSCOPE VALUES*/
        $rootScope.fullpageview = false;

        console.log($.jStorage.get("navigation"));
        if ($.jStorage.get("navigation")) {
            $rootScope.navigation = $.jStorage.get("navigation");
        } else {
            $.jStorage.set("navigation", [{
                location: "/home",
                title: "INQ",
                position: 0,
                clickable: true
        }]);
            $rootScope.navigation = $.jStorage.get("navigation");
        };

        /*NAVIGATION FROM NAV MENU*/
        $rootScope.gotonav = function (clickable, loc) {
            if (clickable) {
                $location.path(loc);
            };
        };


        $('.button-collapse').sideNav({
            menuWidth: 350, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens,

        });

        /*Reload controller*/
        $rootScope.reloadpage = function () {
            $rootScope.errormsg = '';
            $route.reload();
        };

        $scope.logout = function () {
            $location.path('/login');
        };

  }]);

inqcontroller.controller('appCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
 function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {

        $rootScope.showmenu = true;

 }]);
