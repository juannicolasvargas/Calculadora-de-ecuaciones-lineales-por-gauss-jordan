(function(){
  'use strict';
  angular.module('spades')
  .controller('GaussianEliminationController',['$scope','$state',function($scope,$state){
    $scope.dimensions = '';
    $scope.matrix = [];
    $scope.results = [];
    $scope.identity_matrix = [];


    $scope.createMatriz = function(dimensions){
      $scope.results = []
      $scope.matrix = new Array(dimensions);
      //console.log(dimensions);
      for (var i = 0; i < dimensions; i++) {
        $scope.matrix[i] = new Array(dimensions);
        for (var j = 0; j < dimensions; j++) {
          //console.log("["+i+"]["+j+"]");
          $scope.matrix[i][j] = "";
        }
      }
      //console.log($scope.matrix[0][2]);
    }
    // Valida que solo se ingresen numeros
    $scope.onlyNumber = function(parameter){
      let out = '';
      let filtro = '1234567890-/.';
      for (let i = 0; i < parameter.currentTarget.value.length; i++) {
        if (filtro.indexOf(parameter.currentTarget.value.charAt(i)) != -1) {
          out += parameter.currentTarget.value.charAt(i);
        } 
      }
      parameter.currentTarget.value = out
    }

    $scope.calculate = function(){      
      FormatData($scope.matrix, $scope.results);
      $scope.identity_matrix = crea_matriz_identidad($scope.matrix, $scope.results);   
    }


    function FormatData(matrix, results){     
      matrix.forEach( function(matriz, indicei) {
        matriz.forEach( function(valor, indicej) {
          
          if(valor.indexOf('/') != -1){
              var separator = valor.split("/");              
              $scope.matrix[indicei][indicej] = (separator[0] / separator[1]);
          }
        });                
    });

      
      console.log(results);
      results.forEach( function(result, indicei) {
        if(result.indexOf('/') != -1){
          var separator = result.split("/");          
          $scope.results[indicei] = (separator[0] / separator[1]);
      }                    
      });
    }



    function crea_matriz_identidad(A, b, update) {
      var data = [];
      var lu = descomposicion_superior_inferior(A, update)
      if (lu === undefined) return      
      var array = EliminacionGaussiana(lu, b, update)
      array.forEach( function(result, indicei) {              
        data.push(decimalToFraction(result, false));
       /* if(result.toString().indexOf('.') != -1){          
          if(result.toString().indexOf('.0000') != -1){
            var separator = result.toString().split(".");             
            data.push(separator[0]);   
          }
          else{
            data.push( Math.round10(result.toFixed(2), -1));             
          }          
      }      
      else{
        data.push(result);
      }*/
      });      
      return data
    };

    function decimalToFraction(value, donly = true) {
      var tolerance = 1.0E-6; // a partir de cuantas decimales se hace el redondeo
      var h1 = 1;
      var h2 = 0;
      var k1 = 0;
      var k2 = 1;
      var negative = false;
      var i;
     
      if (parseInt(value) == value) { // si el valor es un número entero, detener el código
        return value;
      } else if (value < 0) {
        negative = true;
        value = -value;
      }
     
      if (donly) {
        i = parseInt(value);
        value -= i;
      }
     
      var b = value;
     
      do {
        var a = Math.floor(b);
        console.log(a)
        var aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
      } while (Math.abs(value - h1 / k1) > value * tolerance);     
     var result = '';
     if(k1 == 1 && h1 != 0){
       result = h1

     }else{
       result = (h1 == 0 ? '' : h1 + "/" + k1)
     }
      return (negative ? "-" : '') + ((donly & (i != 0)) ? i + ' ' : '') + result;
    }

    function intlRound(numero, decimales = 2, usarComa = false) {    
      var opciones = {
          maximumFractionDigits: decimales, 
          useGrouping: false
      };
      usarComa = usarComa ? "es" : "en";
      return new Intl.NumberFormat(usarComa, opciones).format(numero);      
  }
 
    function descomposicion_superior_inferior(A, update) {
      var d = true;
      var n = A.length;
      var idx = new Array(n);
      var vv = new Array(n);
     
      for (var i=0; i<n; i++) {
        var max = 0
        for (var j=0; j<n; j++) {
          var temp = Math.abs(A[i][j])
          if (temp > max) max = temp
        }
        if (max == 0) return
        vv[i] = 1 / max
      }
     
      if (!update) {
        var Acpy = new Array(n)
        for (var i=0; i<n; i++) {   
          var Ai = A[i] 
          var Acpyi = new Array(Ai.length)
          for (j=0; j<Ai.length; j+=1) Acpyi[j] = Ai[j]
          Acpy[i] = Acpyi
        }
        A = Acpy
      }
     
      var tiny = 1e-20
      for (var i=0; ; i++) {
        for (var j=0; j<i; j++) {
          var sum = A[j][i]
          for (var k=0; k<j; k++) sum -= A[j][k] * A[k][i];
          A[j][i] = sum
        }
        var jmax = 0
        var max = 0;
        for (var j=i; j<n; j++) {
          var sum = A[j][i]
          for (var k=0; k<i; k++) sum -= A[j][k] * A[k][i];
          A[j][i] = sum
          var temp = vv[j] * Math.abs(sum)
          if (temp >= max) {
            max = temp
            jmax = j
          }
        }
        if (i <= jmax) {
          for (var j=0; j<n; j++) {
            var temp = A[jmax][j]
            A[jmax][j] = A[i][j]
            A[i][j] = temp
          }
          d = !d;
          vv[jmax] = vv[i]
        }
        idx[i] = jmax;
        if (i == n-1) break;
        var temp = A[i][i]
        if (temp == 0) A[i][i] = temp = tiny
        temp = 1 / temp
        for (var j=i+1; j<n; j++) A[j][i] *= temp
      }
      return {A:A, idx:idx, d:d}
    }
     
    function EliminacionGaussiana(lu, b, update) {
      var A = lu.A
      var idx = lu.idx
      var n = idx.length
     
      if (!update) {
        var bcpy = new Array(n) 
        for (var i=0; i<b.length; i+=1) bcpy[i] = b[i]
        b = bcpy
      }
     
      for (var ii=-1, i=0; i<n; i++) {
        var ix = idx[i]
        var sum = b[ix]
        b[ix] = b[i]
        if (ii > -1)
          for (var j=ii; j<i; j++) sum -= A[i][j] * b[j]
        else if (sum)
          ii = i
        b[i] = sum
      }
      for (var i=n-1; i>=0; i--) {
        var sum = b[i]
        for (var j=i+1; j<n; j++) sum -= A[i][j] * b[j]
        b[i] = sum / A[i][i]
      }
      return b
    }

  }]);
})();