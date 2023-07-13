angular.module('app', [])
    .controller('mainCtrl', function($scope, $http) {
        console.log("$http",$http);
        //Levanta los datos cuando se refresca la pagina
        var refresh = function(){
            $http({
                method: 'GET',
                url: '/search',
                params: {"name": $scope.search, "category": $scope.category}
            })
            .then(function(response) {
                console.log("hola, todo ok", response);
                $scope.games = response.data;
                $scope.game = ({});
            }, function errorCallback(response) {
                console.log("hola, todo mal!!", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        var getCategories = function(){
            $http({
                method: 'GET',
                url: '/categories'
            })
            .then(function(response) {
                console.log("hola, todo ok", response);
                // each categories has a name and a boolean to know if it is selected
                $scope.categories = response.data.map(function(category){
                    return {name: category, checked: true};
                });
            }, function errorCallback(response) {
                console.log("hola, todo mal!!", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.propertyName = 'name';
        $scope.reverse = true;

        $scope.options = ['appid', 'name', 'release_date', 'average_playtime', 'price'];

        $scope.search = '';
        $scope.category = [];

        $scope.limCat = 7;
        refresh();
        getCategories();

        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        }
        $scope.searchBy = function(){
            refresh();
        }
        $scope.toggleShowCategories = function(){
            if($scope.limCat == 7){
                $scope.limCat = $scope.categories.length;
            }else{
                $scope.limCat = 7;
            }
            refresh();
        }
        //Add Game
        $scope.addGame = function () {
            console.log($scope.game);
            $http.post('/game',$scope.game)
            .then(function(response) {
                refresh();
                console.log("Ok ADD", response);
            }, function errorCallback(response) {
                console.log("Bad ADD", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        //Remove
        $scope.remove = function(id){
            console.log("Remove: ", id);
            $http.delete('/game/' + id)
            .then(function(response) {
                refresh();
                console.log("Ok delete", response);
            }, function errorCallback(response) {
                console.log("BAD delete!!", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        $scope.edit = function(id){
            console.log("Edit: ", id);
            $http.get('/game/' + id)
            .then(function(response) {
                $scope.game.appid = response.data.appid;
                $scope.game.name = response.data.name;
                $scope.game.release_date = response.data.release_date;
                $scope.game.average_playtime = response.data.average_playtime;
                $scope.game.price = response.data.price;
                console.log("OK Edit RD: ", response.data);
            }, function errorCallback(response) {
                console.log("Bad edit!!", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        $scope.update = function(){
            console.log("UPDATE: ", $scope.game);
            $http.put('/game/' + $scope.game.appid, $scope.game)
            .then(function(response) {
                refresh();
                console.log("OK Update", response);
            }, function errorCallback(response) {
                refresh();
                console.log("BAD Update!!", response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        $scope.deselect = function(){
            $scope.game = ({});
        }
    });
