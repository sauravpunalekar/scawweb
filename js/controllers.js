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
        $scope.template = TemplateService;
        TemplateService.content = "views/content.html";
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
        var loginsuccess = function (response) {
            if (response.data == 'false') {
                console.log('Login error');
                $scope.error = true;


            } else {
                $scope.error = false;
                console.log(response.data);
                $.jStorage.set('user', response.data);
                if ($.jStorage.get('user').access_id != 3) {
                    $location.path('/subjects');
                } else {
                    $location.path('/standards');
                }
            }
        }
        /*function*/
        $scope.dologin = function () {
            $scope.error = false;
            console.log($scope.logindata);
            NavigationService.dologin($scope.logindata.contact, $scope.logindata.password).then(loginsuccess);

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
        }
        var getstandarderror = function (response) {
            console.log(response.data);
        }
        //INITIALIZATIONS
        NavigationService.getstandardsbyboardid($.jStorage.get('user').board_id).then(getstandardsuccess, getstandarderror)
        /*function*/


        // routing
        $scope.gotosubjects = function (standardid) {
            $.jStorage.get('user').standard_id = standardid;
            $location.path('/subjects');
        }
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


        //INITIALIZATIONS
        $scope.cardindex = 0;
        var getcardsuccess = function (response) {
            console.log(response.data);
            $scope.conceptcards = response.data;

            _.forEach($scope.conceptcards, function (value) {
                value.conceptdata = $sce.trustAsHtml(value.conceptdata);
            });

        };
        var getcarderror = function (response) {
            console.log(response.data);
        };
        /*function*/
        NavigationService.getcardsbyconceptid($scope.conceptid).then(getcardsuccess, getcarderror);

        // routing
        $scope.changecardindex = function (index) {
            if ($scope.cardindex == 0 && index == -1) {

            } else if ($scope.cardindex == $scope.conceptcards.length - 1 && index == 1) {} else if ($scope.cardindex >= 0 && $scope.cardindex < $scope.conceptcards.length) {
                $scope.cardindex += index;
            }
        }
  }]);
inqcontroller.controller('testsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {

        $scope.title = "Tests";
        $scope.template = TemplateService;
        TemplateService.content = "views/tests.html";



        //INITIALIZATIONS

        /*function*/


        // routing

  }]);
inqcontroller.controller('conceptsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location) {

        $scope.title = "Concepts";
        $scope.template = TemplateService;
        TemplateService.content = "views/concepts.html";
        $scope.chapterid = $routeParams.chapterid;


        //INITIALIZATIONS

        var getconceptsbychapteridsuccess = function (response) {
            $scope.concepts = response.data;
            console.log(response.data);
        };
        var getconceptsbychapteriderror = function (response) {
            console.log(response.data);
        };
        /*function*/
        NavigationService.getconceptsbychapterid($.jStorage.get('user').id, $scope.chapterid).then(getconceptsbychapteridsuccess, getconceptsbychapteriderror);


        // routing
        $scope.gotoconceptcards = function (id) {
            $location.path('/conceptcards/' + id);
        }
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

        };
        var getsubjectsbyuseriderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getsubjectsbyuserid($.jStorage.get('user').standard_id).then(getsubjectsbyuseridsuccess, getsubjectsbyuseriderror);

        /*function*/


        // routing
        $scope.gotochapters = function (subjectid) {
            $location.path('/chapters/' + subjectid);

        };

  }]);

inqcontroller.controller('chaptersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams', '$location',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/chapters.html";
        $scope.navigation = NavigationService.getnav();

        //INITIALIZATIONS
        $scope.subjectid = $routeParams.subjectid;
        var getchaptersbysubjectidsuccess = function (response) {
            console.log(response.data);
            $scope.chapters = response.data;

        };
        var getchaptersbysubjectiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getchaptersbysubjectid($scope.subjectid).then(getchaptersbysubjectidsuccess, getchaptersbysubjectiderror);


        /*function*/

        // routing
        $scope.gotoconcepts = function (id) {
            $location.path("/concepts/" + id);
        };

  }]);

inqcontroller.controller('menuCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService',
 function ($scope, TemplateService, $location, $rootScope, NavigationService) {
        $scope.template = TemplateService;

        /*INITIALIZATIONS*/


        $('.button-collapse').sideNav({
            menuWidth: 350, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens,

        });

        $scope.logout = function () {
            $location.path('/login');
        };
  }]);
