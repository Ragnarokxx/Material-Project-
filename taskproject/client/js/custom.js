
var myApp = angular.module('myApp',[]).run(function ($http) {
    // Sends this header with any AJAX request
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.common['Access-Control-Allow-Methods'] = "GET, POST, PUT, DELETE, OPTIONS";


}).controller('CustomerController', ['$scope','$http', function($scope,$http) {

    var httpURL = 'http://localhost:3000/order/';


    $scope.OrderDelete = function (id) {

        if(typeof id == "number"){
        $http({
            method: 'GET',
            url: httpURL + 'remove/' +id,
            data:{
                companyName: $('#companyName').val(),
                customerAddress:$('#customerAddress').val(),
                orderedltem: $('#orderedltem').val() ,
                orderCost: $('#orderCost').val()

            }


        }).then(function successCallback(response) {

            var data = angular.fromJson(response.data);

            if(data.removed)
            {

                swal ( "Deleted" ,  "Order Deleted!" ,  "info" );
            }


            $scope.OrderList();

        }, function errorCallback(response) {

        });
        }

    };


    $scope.Order = function(id) {

        $scope.FormClear();

        if(id)
            $scope.OrderEdit(id);



    };


    $scope.OrderSave = function () {

     if(typeof $scope.orderId == "number" && $scope.orderId>0)
         var postURL = httpURL + 'update/' + $scope.orderId;
         else
         var postURL = httpURL + 'create';

         $http({
             method: 'POST',
             url: postURL,
             data:{
                 companyName: $('#companyName').val(),
                 customerAddress:$('#customerAddress').val(),
                 orderedltem: $('#orderedltem').val() ,
                 orderCost: $('#orderCost').val()

             }


         }).then(function successCallback(response) {

             var data = angular.fromJson(response.data);

             if(data.save)
             {
                 $('#orderEdit').modal('toggle');
                 if(typeof $scope.orderId == "number")
                 swal ( "Success" ,  "Order Updated!" ,  "success" );
                 else
                 swal ( "Success" ,  "Order Saved !" ,  "success" );

             }


             $scope.OrderList();

         }, function errorCallback(response) {

         });


     };

    $scope.OrderEdit = function (id) {

        $http({
            method: 'GET',
            url: httpURL + 'read/'+id


        }).then(function successCallback(response) {

        var data = angular.fromJson(response.data);


            $scope.companyName = data['companyName'];
            $scope.customerAddress = data['customerAddress'];
            $scope.orderedltem = data['orderedltem'];
            $scope.orderCost = data['orderCost'];
            $scope.orderId = data['orderld'];


            $scope.OrderList();

        }, function errorCallback(response) {

        });

    };

    $scope.FormClear = function () {

      $('#companyName').val('');
      $('#customerAddress').val('');
      $('#orderedltem').val(0) ;
      $('#orderCost').val(0);
      $('#orderId').val(0);


        $scope.companyName = null;
        $scope.customerAddress = null;
        $scope.orderedltem = 0;
        $scope.orderCost = 0;
        $scope.orderId =  null;

    };

    $scope.OrderList = function()
    {
        $http({
            method: 'GET',
            url: httpURL + 'read'


        }).then(function successCallback(response) {

            $scope.orders = angular.fromJson(response.data);

        }, function errorCallback(response) {

        });

    };

    $scope.OrderList();

}]);