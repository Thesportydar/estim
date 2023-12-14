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
        var refresh = function () {
            $http({
                method: "GET",
                url: "/categories",
            }).then(
                function (response) {
                    console.log("hola, todo ok", response);
                    $scope.categories = response.data;
                },
                function errorCallback(response) {
                    console.log("hola, todo mal!!", response);
                }
            );
            $http({
                method: "GET",
                url: "/genres",
            }).then(
                function (response) {
                    console.log("hola, todo ok", response);
                    $scope.genres = response.data;
                },
                function errorCallback(response) {
                    console.log("hola, todo mal!!", response);
                }
            );
        }
        
        $scope.gotoMain = function () {
            $location.path("/").search({});
        };
        
        $scope.gotoSearch = function () {
            $location.path("/search").search({});
        };
        
        $scope.gotoCategory = function (category) {
            $location.path("/search").search("category", category);
        };

        $scope.gotoGenre = function (genre) {
            $location.path("/search").search("genre", genre);
        };
        
        $scope.showCatDropdown = false;
        $scope.showGenreDropdown = false;
        $scope.showFeaturedDropdown = false;
        refresh();
    })
    .controller("mainCtrl", function ($scope, $http, $location, $interval) {
      $scope.featuredGames = [];
      $scope.free_to_play = [];
      $scope.currentIndex = 0;

      $http({
          method: "GET",
          url: "/initMain",
          params: {}
      }).then(function (response) {
          $scope.featuredGames = response.data.recomendacion;
          $scope.free_to_play = response.data.free_to_play;
      }, function errorCallback(response) {
          console.log("Error al cargar datos", response);
      });

      var intervalPromise;
      var autoScrollInterval = 5000; // 5 segundos

      function startAutoScroll() {
          intervalPromise = $interval(function () {
              $scope.currentIndex = ($scope.currentIndex + 1) % $scope.featuredGames.length;
              scrollToCurrentGame();
          }, autoScrollInterval);
      }

      function stopAutoScroll() {
          $interval.cancel(intervalPromise);
      }

      function scrollToCurrentGame() {
          var thumbnailHeight = 80; // Ajusta este valor según la altura de tus miniaturas
          var container = document.querySelector('.main-thumbnails');
          container.scrollTop = $scope.currentIndex * thumbnailHeight;
      }

      $scope.changeGame = function (index) {
          $scope.currentIndex = index;
          scrollToCurrentGame();

          // Marcar el juego seleccionado con la clase 'active'
          angular.forEach($scope.featuredGames, function (game, i) {
            game.active = i === index;
          });
      };

      // Iniciar el desplazamiento automático cuando se carga la página
      startAutoScroll();

      // Detener el desplazamiento automático cuando se destruye el controlador
      $scope.$on('$destroy', function () {
          stopAutoScroll();
      });
    })
    .controller("searchCtrl", function ($scope, $http, $location) {
  console.log("$http", $http);
  //Levanta los datos cuando se refresca la pagina
  var refresh = function () {
    console.log("filters", $scope.filters);
    if ($location.search().category) {
        for (let i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].name == $location.search().category) {
                if (!$scope.categories[i].checked) {
                    $scope.categories[i].checked = true;
                    $scope.filters[0].push($scope.categories[i].name);
                }
                break;
            }
        }
    };

    if ($location.search().genre) {
        for (let i = 0; i < $scope.genres.length; i++) {
            if ($scope.genres[i].name == $location.search().genre) {
                if (!$scope.genres[i].checked) {
                    $scope.genres[i].checked = true;
                    $scope.filters[1].push($scope.genres[i].name);
                }
                break;
            }
        }
    };

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
            $scope.priceRange = $scope.maxPrice;
            console.log("refresh1normal");
            //refresh();
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

  initSearch();

  $scope.sortBy = function (propertyName) {
    $scope.reverse =
      $scope.propertyName === propertyName ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
  $scope.searchBy = function () {
    console.log("refresh2");
    refresh();
  };
  $scope.toggleShowFilter = function (li, newLim) {
    if ($scope.lims[li] == 7) {
      $scope.lims[li] = newLim;
    } else {
      $scope.lims[li] = 7;
    }
    console.log("refresh3");
    refresh();
  };
  $scope.filterBy = function (fi, fil) {
    if (fil.checked) {
      $scope.filters[fi].push(fil.name);
    } else {
      var index = $scope.filters[fi].indexOf(fil.name);
      $scope.filters[fi].splice(index, 1);
    }
    console.log("refresh4");
    refresh();
  };
    $scope.filterByPrice = function () {
        console.log("refresh5");
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

                var percentage = ($scope.game.positive_ratings / $scope.game.total_ratings) * 100;

                $scope.fullStars = Math.floor(percentage / 20);
                $scope.halfStars = percentage % 20 >= 10 ? 1 : 0;
                $scope.emptyStars = 5 - $scope.fullStars - $scope.halfStars;
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

    $scope.getStarsArray = function(num) {
        // Devuelve un array con el número de elementos igual a num
        return new Array(num);
    };
});
