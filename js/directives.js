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