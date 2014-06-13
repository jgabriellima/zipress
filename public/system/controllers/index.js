'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', '$http',
    function($scope, Global, $http) {
        $scope.global = Global;
  

        $scope.init = function() {

        }

        $scope.zipress = function() {
            // alert($scope.file.url);
           $("#loading").show();
            $http({
                method: 'GET',
                url: "/zipress?url=" + $scope.file.url
            }).
            success(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                if(data.status === 'ok'){
                    window.location= 'http://'+data.url;
                }
               $("#loading").hide();
            }).
            error(function(data, status, headers, config) {
                alert("Desculpe! Ocorreu um erro, por favor tente novamente.")
               $("#loading").hide();
            });

        };
    }
]);
