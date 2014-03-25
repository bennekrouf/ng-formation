"use strict";

var app = angular.module('app', []);

app.controller('Ctrl', function($scope) {

    var zoom = 10;

    $scope.maps = [
        { center: {lat: 43.6, lng: 4}, zoom: zoom }
        //,{ center: {lat: 43.6, lng: 4}, zoom: zoom +2 }
        //,{ center: {lat: 42, lng: 9}, zoom: 8 }
    ];
});

app.directive('gmaps', function factory($timeout) {
    return {
        restrict: 'EA',
//        templateUrl: 'gmaps.html',

        template: '<div>' 
                    +'<div class="gmaps"></div>'
                    +'<form role="form">'
                    +'    <input type="text" name="" id="input" class="form-control" ng-model="label">'
                    +'    <button type="submit" class="btn btn-primary" ng-click="snap(snapshot)" >Snap</button>'
                    +'</form>'
                    +'<div>'
                    +'    <button ng-repeat="snapshot in snapshots"' 
                    +'                type="button" class="btn btn-default btn-lg" ng-click="selectSnapshot(snapshot)">'
                    +'                {{snapshot.label}}'
                    +'    </button>'
                    +'</div>'
                    +'</div>' 
        ,replace: true,
        scope: {
            center: '=',
            zoom: '='
        },
        link: function postLink(scope, iElement, iAttrs) {

            var mapOptions = {
                zoom: scope.zoom,
                center: new google.maps.LatLng(scope.center.lat, scope.center.lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(iElement.find('div')[0], mapOptions);

            scope.snapshots = [];

            scope.snap = function(){

                new google.maps.Marker({
                    position: new google.maps.LatLng(scope.center.lat, scope.center.lng),
                    map: map,
                    title: scope.label
                });
               
                var snapi = { center: {lat: scope.center.lat , lng: scope.center.lng} , zoom: scope.zoom, label: scope.label };

                scope.snapshots.push(snapi);
                scope.label = "";
            };

            scope.selectSnapshot = function(snapshot){
                map.setZoom(snapshot.zoom);
                map.setCenter(new google.maps.LatLng(snapshot.center.lat, snapshot.center.lng));
            };

            scope.$watch('zoom', function () {
                map.setZoom(scope.zoom);
            });

            scope.$watch('center', function () {
                map.setCenter(new google.maps.LatLng(scope.center.lat, scope.center.lng));
            }, true);

            google.maps.event.addListener(map, 'zoom_changed', function () {
                $timeout(function () {
                    scope.zoom = map.getZoom();
                });
            });

            google.maps.event.addListener(map, 'center_changed', function () {
                $timeout(function () {
                    var center = map.getCenter();
                    scope.center.lat = center.lat();
                    scope.center.lng = center.lng();
                });
            });
        }
    };
});