'use strict';

/* Directives */

var labbookDirectives = angular.module('labbookDirectives', []);

labbookDirectives.directive('chart', function(){
  return{
    restrict: 'E',
    link: function(scope, elem, attrs){
      
      var chart = null,
          opts  = { };
      
      scope.$watch(attrs.ngModel, function(v){
        if(!chart){
          chart = $.plot(elem, v , opts);
          elem.show();
        }else{
          chart.setData(v);
          chart.setupGrid();
          chart.draw();
          scope.lastValue = v[0][v[0].length-1][1];
        }
      }, true);
    }
  };
});