angular.module("app",["ngRoute", "ngTouch", "angular-carousel", "ngSanitize"])
        .config(["$routeProvider", function ($routeProvider) {
            $routeProvider
            .when("/", {
                templateUrl: "main.html",
                controller: "mainCtrl"
            })
            .when("/search", {
              templateUrl: "search.html",
              controller: "searchCtrl"
            })
            .when("/game/:game", {
                templateUrl: "game.html",
                controller: "gameCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
        }])
    .controller("indexCtrl", function ($scope, $http, $location) {
        $scope.gotoMain = function () {
            $location.path("/");
        };
        $scope.gotoSearch = function () {
            $location.path("/search");
        };
    })
    .controller("mainCtrl", function ($scope, $http, $location) {
    })
    .controller("searchCtrl", function ($scope, $http, $location) {
  console.log("$http", $http);
  //Levanta los datos cuando se refresca la pagina
  var refresh = function () {
    $http({
      method: "GET",
      url: "/search",
      params: {
        name: $scope.search,
        categories: $scope.filters[0],
        genres: $scope.filters[1],
        tags: $scope.filters[2],
        priceRange: $scope.priceRange,
      },
    }).then(
      function (response) {
        console.log("hola, todo ok", response);
        $scope.games = response.data;
        $scope.game = {};
      },
      function errorCallback(response) {
        console.log("hola, todo mal!!", response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      }
    );
  };
  var initSearch = function () {
    $http({
        method: "GET",
        url: "/initSearch",
        }).then(
        function (response) {
            console.log("hola, todo ok", response);
            $scope.maxPrice = response.data.maxPrice;
            $scope.tags = response.data.tags.map(function (tag) {
                return { name: tag, checked: false };
            });
            $scope.genres = response.data.genres.map(function (genre) {
                return { name: genre, checked: false };
            });
            $scope.categories = response.data.categories.map(function (category) {
                return { name: category, checked: false };
            });
            $scope.maxPrice = response.data.maxPrice;
        },
        function errorCallback(response) {
            console.log("hola, todo mal!!", response);
        }
    );
  };


  $scope.propertyName = "name";
  $scope.reverse = false;

  $scope.options = [
    "appid",
    "name",
    "release_date",
    "price",
  ];

  $scope.search = "";
  $scope.filters = [[], [], []];

  $scope.lims = [7, 7, 7];

  refresh();
  initSearch();
  $scope.priceRange = $scope.maxPrice;

  $scope.sortBy = function (propertyName) {
    $scope.reverse =
      $scope.propertyName === propertyName ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
  $scope.searchBy = function () {
    refresh();
  };
  $scope.toggleShowFilter = function (li, newLim) {
    if ($scope.lims[li] == 7) {
      $scope.lims[li] = newLim;
    } else {
      $scope.lims[li] = 7;
    }
    refresh();
  };
  $scope.filterBy = function (fi, fil) {
    if (fil.checked) {
      $scope.filters[fi].push(fil.name);
    } else {
      var index = $scope.filters[fi].indexOf(fil.name);
      $scope.filters[fi].splice(index, 1);
    }
    refresh();
  };
    $scope.filterByPrice = function () {
        refresh();
    };
$scope.gotoGame = function (appid) {
    $location.path("/game/" + appid);
};
})
.controller("gameCtrl", function ($scope, $http, $routeParams, $sce) {
    var refresh = function () {
        $http({
          method: "GET",
          url: "/game/" + $routeParams.game,
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                $scope.game = response.data;
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
    };
    refresh();
    $scope.carouselIndex = 0;
    $scope.showMoreReq = false;
    $scope.showMoreDesc = false;
    $scope.pcReq =true;
    $scope.macReq =false;
    $scope.linuxReq =false;

    $scope.updateCarouselIndex = function(index) {
      $scope.carouselIndex = index; // Actualiza el índice del carrusel
    };

    $scope.trustedHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

  $scope.toggleShowMoreReq = function() {
      $scope.showMoreReq = !$scope.showMoreReq;
      $scope.$apply();
  };

  $scope.toggleShowMoreDesc = function() {
    $scope.showMoreDesc = !$scope.showMoreDesc;
    $scope.$apply();
  };

  $scope.showPcReq = function() {
    $scope.pcReq = true;
    $scope.macReq = false;
    $scope.linuxReq = false;
  };

  $scope.showMacReq = function() {
    $scope.pcReq = false;
    $scope.macReq = true;
    $scope.linuxReq = false;
  };

  $scope.showLinuxReq = function() {
    $scope.pcReq = false;
    $scope.macReq = false;
    $scope.linuxReq = true;
  };
});

function changeBackground(checkbox) {
    let td = checkbox.parentNode.parentNode;
    if (checkbox.checked) {
        td.classList.remove("filter");
        td.classList.add("selected");
    } else {
        td.classList.add("filter");
        td.classList.remove("selected");
    }
};
