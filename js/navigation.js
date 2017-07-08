var navigationservice = angular.module('navigationservice', [])

    .factory('NavigationService', function ($http) {

        //MACBOOK AND HOME LAPTOP
        var adminurl = "http://192.168.0.101/rest/rest/index.php/";
        //PC
        //var adminurl = "http://localhost/inqrest/rest/index.php/";
        //SERVER
        //var adminurl = "http://learnwithinq.com/adminpanel/rest/index.php/";
        //HOME LAPTOP

        var navigation = [{
            name: "Home",
            classis: "active",
            link: "#/home",
            subnav: []
    }, {
            name: "About",
            active: "",
            link: "#/about",
            subnav: []
    }, {
            name: "Services",
            classis: "",
            link: "#/services",
            subnav: []
    }, {
            name: "Portfolio",
            classis: "",
            link: "#/portfolio",
            subnav: []
    }, {
            name: "Contact",
            classis: "",
            link: "#/contact",
            subnav: []
    }];

        return {
            getnav: function () {
                return navigation;
            },
            makeactive: function (menuname) {
                for (var i = 0; i < navigation.length; i++) {
                    if (navigation[i].name == menuname) {
                        navigation[i].classis = "active";
                    } else {
                        navigation[i].classis = "";
                    }
                }
                return menuname;
            },
            getsubjectsbyuserid: function (id) {
                return $http.get(adminurl + 'subjects/getmanyby', {
                    params: {
                        field: 'standard_id',
                        value: id
                    }
                })

            },
            getchaptersbysubjectid: function (id) {

                return $http.get(adminurl + 'chapters/getchaptersbysubjectid', {
                    params: {
                        subjectid: id
                    }
                })
            },
            dologin: function (contact, password) {
                return $http.get(adminurl + 'users/scawlogin', {
                    params: {
                        contact: contact,
                        password: password
                    }
                })
            },

            getstandardsbyboardid: function (id) {
                return $http.get(adminurl + 'standards/getmanyby', {
                    params: {
                        field: 'board_id',
                        value: id
                    }
                })
            },
            
            getconceptsbychapterid: function (uid, chptid) {
                return $http.get(adminurl + 'concepts/getconceptsbychapterid', {
                    params: {
                        userid: uid,
                        chapterid: chptid                        
                    }
                })
            },
            getcardsbyconceptid: function(id){
                 return $http.get(adminurl + 'concepts/getcardsbyconceptid', {
                    params: {
                        conceptid: id
                    }
                })
            },
        }
    });
