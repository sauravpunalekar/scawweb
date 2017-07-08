// JavaScript Document
var inq = angular.module('inq', ['ngRoute', 'inqcontroller', 'templateservicemod', 'navigationservice', 'angularFileUpload',  'angular-loading-bar'
]);

/*
Client ID : 951565546728-s8mpt0u6nblg7qv6mpom6arvqm2o7qp8.apps.googleusercontent.com
Client Secret ID: qVyozubT7R6e2R3opkQq1Rhv
*/

inq.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'views/template.html',
            controller: 'home'
        }).
          when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        }).
          when('/subjects', {
            templateUrl: 'views/template.html',
            controller: 'subjectsCtrl'
        }).
        when('/standards', {
            templateUrl: 'views/template.html',
            controller: 'standardsCtrl'
        }).
        when('/tests', {
            templateUrl: 'views/template.html',
            controller: 'testsCtrl'
        }).
        when('/concepts/:chapterid', {
            templateUrl: 'views/template.html',
            controller: 'conceptsCtrl'
        }).
        when('/testresults', {
            templateUrl: 'views/template.html',
            controller: 'testresultsCtrl'
        }).
          when('/chapters/:subjectid', {
            templateUrl: 'views/template.html',
            controller: 'chaptersCtrl'
        }).
        when('/conceptcards/:conceptid', {
            templateUrl: 'views/template.html',
            controller: 'conceptcardsCtrl'
        }).
       
        otherwise({
            redirectTo: '/home'
        });
  }]);

inq.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


inq.filter('imagepath', function () {
    return function (input) {
        return "http://localhost/rest/rest/uploads/" + input;
        //return "http://learnwithinq.com/adminpanel/rest/uploads/" + input;
    };
    
});
inq.directive('ngEnter', function() {
       return function(scope, element, attrs) {
           element.bind("keydown keypress", function(event) {
               if(event.which === 13) {
                   scope.$apply(function(){
                       scope.$eval(attrs.ngEnter, {'event': event});
                   });

                   event.preventDefault();
               }
           });
       };
   });