'use strict';

/* Directives */

var labbookDirectives = angular.module('labbookDirectives', []);
labbookDirectives.directive('chart', function(){
  return{
    restrict: 'E',
    link: function(scope, elem, attrs){
      
      var chart = null,
          opts  = { 
            xaxis: {
              font:{
                color: "#000000"
              },
            },
            yaxis: {
              font:{
                color: "#000000"
              },
            },
            series: {
              lines: { 
                show: true,
                lineWidth: 6,
                fill: false,
              },


            },
            grid: {
              show: true,
              backgroundColor: "#cccccc",
              borderWidth: 30,
              borderColor: "#cccccc",
              minBorderMargin: 30,
            },
            colors:["#e52a20"]
          };
      
      scope.$watch(attrs.ngModel, function(v){
        if(!chart){
          chart = $.plot(elem, [v] , opts);
          elem.show();
        }else{
          chart.setData([v]);
          chart.setupGrid();
          chart.draw();
        }
      }, true);
    }
  };
});

labbookDirectives.directive('stream', function(){
  return{
    restrict: 'E',
    link: function(scope, elem, attrs){
      
      var chart = null,
          opts  = { 
            xaxis: {
              font:{
                color: "#000000"
              },
            },
            yaxis: {
              font:{
                color: "#000000"
              },
            },
            series: {
              lines: { 
                show: true,
                lineWidth: 6,
                fill: false,
                borderColor: null,
                clickable: true,
              },


            },
            grid: {
              show: true,
              backgroundColor: null,
            },
            colors:["#e52a20"]
          };
      
      scope.$watch(attrs.ngModel, function(v){
        if(!chart){
          chart = $.plot(elem, [[[0,0],[1,1],[2,1],[3,0]]] , opts);
          elem.show();
        }else{
          chart.setData([[[0,0],[1,1],[2,1],[3,0]]]);
          chart.setupGrid();
          chart.draw();
        }
      }, true);
    }
  };
});