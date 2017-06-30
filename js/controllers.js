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
inqcontroller.controller('loginCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {
       
        $scope.title = "Login";
       
       

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
        NavigationService.getsubjectsbyuserid(1).then(getsubjectsbyuseridsuccess, getsubjectsbyuseriderror);

        /*function*/


        // routing
        $scope.gotochapters = function (subjectid) {
            $location.path('/chapters/' + subjectid);

        };

  }]);

inqcontroller.controller('chaptersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$routeParams',
  function ($scope, TemplateService, NavigationService, $rootScope, $routeParams) {
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

  }]);

inqcontroller.controller('menuCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService',
 function ($scope, TemplateService, $location, $rootScope, NavigationService) {
        $scope.template = TemplateService;

        /*INITIALIZATIONS*/


        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens,

        });

        $scope.logout = function () {
            $location.path('/login');
        };
  }]);
