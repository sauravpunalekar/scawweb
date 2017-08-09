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
        TemplateService.content = "views/standards.html";

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

inqcontroller.controller('conceptcardsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval', '$routeParams', '$sce',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval, $routeParams, $sce) {

        $scope.title = "ConceptCards";
        $scope.template = TemplateService;
        TemplateService.content = "views/conceptcards.html";
        $scope.conceptid = $routeParams.conceptid;

        var cw = $('.cardbut').width();
        $('.cardbut').css({
            'height': cw + 'px'
        });
        console.log("test");

        $interval(2000, function () {
            var sw = $('.starbut').width();
            $('.starbut').css('height', '104px');
        }, 1);

        $rootScope.$watch(function () {
            var math = document.getElementById("carddata");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], math);
            return true;
        });

        //INITIALIZATIONS
        $scope.cardindex = -1; // Initially set the cardindex to -1 so if there are no cards it appeards 0/0 cards
        $scope.user = $.jStorage.get("user");

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
            $scope.changecardindex(1);
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

        $scope.savecustomusercard = function () {
            console.log($scope.conceptcards[$scope.cardindex]);
            NavigationService.savecustomcards($scope.conceptcards[$scope.cardindex]).then(savecustomcardssuccess, savecustomcardserror);
        };
        $scope.editcustomusercard = function () {
            $scope.conceptcards[$scope.cardindex].editmode = true;
        };

  }]);

inqcontroller.controller('testsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $interval) {

        $scope.title = "Tests";
        $scope.template = TemplateService;
        TemplateService.content = "views/tests.html";

        //INITIALIZATIONS

        //STYLING
        $interval(function () {
            var height = $('.optiondiv').height();
            $scope.upperpadding = height / 2;

            $interval(function () {
                var upperheight = $('.upperdiv').outerHeight();
                console.log(upperheight);
                $scope.optionmargin = upperheight - 52 - (height / 2);

                console.log($scope.optionmargin);
            }, 200, 1);

            $('.bottomnav').width($('.bd').width());

            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrainWidth: false, // Does not change width of dropdown to that of the activator
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stopPropagation: false // Stops event propagation
            });

            $('.dropdown1').height($('.qndiv').height());

        }, 200, 1);

        /*function*/

        // routing

  }]);

inqcontroller.controller('conceptsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.title = "Concepts";
        $scope.template = TemplateService;
        TemplateService.content = "views/concepts.html";
        $scope.chapterid = $routeParams.chapterid;

        //INITIALIZATIONS

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

        /*function*/
        $rootScope.loadingdiv = true;
        NavigationService.getconceptsbychapterid($.jStorage.get('user').id, $scope.chapterid).then(getconceptsbychapteridsuccess, getconceptsbychapteriderror);

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
        $scope.conceptwidth = 70;

        //INITIALIZATIONS

        /*function*/

        // routing

  }]);

inqcontroller.controller('subjectsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $location) {

        $scope.template = TemplateService;
        TemplateService.content = "views/subjects.html";
        $scope.navigation = NavigationService.getnav();

        //INITIALIZATIONS
        var getsubjectsbyuseridsuccess = function (response) {
            console.log(response.data);
            $scope.subjects = response.data;
            $rootScope.loadingdiv = false;
        };

        var getsubjectsbyuseriderror = function (response) {
            console.log(response.data);
        };

        $rootScope.loadingdiv = true;
        NavigationService.getsubjectsbyuserid($.jStorage.get('user').standard_id).then(getsubjectsbyuseridsuccess, getsubjectsbyuseriderror);

        /*function*/

        // routing
        $scope.gotochapters = function (subjectid) {
            $location.path('/chapters/' + subjectid);
        };

  }]);

inqcontroller.controller('chaptersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location', '$interval',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location, $interval) {

        $scope.template = TemplateService;
        TemplateService.content = "views/chapters.html";
        $scope.navigation = NavigationService.getnav();

        //STYLING

        //INITIALIZATIONS
        $scope.subjectid = $routeParams.subjectid;

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

        /*function*/

        // routing
        $scope.gotoconcepts = function (id) {
            $location.path("/concepts/" + id);
        };

  }]);

inqcontroller.controller('menuCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService', '$route',
 function ($scope, TemplateService, $location, $rootScope, NavigationService, $route) {

        $scope.template = TemplateService;

        /*INITIALIZATIONS*/
        $scope.user = $.jStorage.get("user");
        $rootScope.showmenu = true;

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
