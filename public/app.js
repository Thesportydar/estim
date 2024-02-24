angular.module("app",["ngRoute", "ngTouch", "angular-carousel", "ngSanitize", "ngDialog"])
        .config(["$routeProvider", function ($routeProvider) {
            $routeProvider
            .when("/", {
                templateUrl: "views/main.html",
                controller: "mainCtrl"
            })
            .when("/search", {
              templateUrl: "views/search.html",
              controller: "searchCtrl"
            })
            .when("/game/:game", {
                templateUrl: "views/game.html",
                controller: "gameCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
        }])
    .service("userService", function () {
        var userType = "user";
        return {
            getUserType: function () {
                return userType;
            },
            setUserType: function (value) {
                userType = value;
            }
        };
    })
    .controller("indexCtrl", function ($scope, $http, $location, userService) {
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
        };

        $scope.newGame = function () {
            $http({
                method: "POST",
                url: "/game",
                data: {
                    name: "New Game",
                    short_description: "Short description",
                    categories: [],
                    genres: [],
                    steamspy_tags: [],
                    developer: [],
                    publisher: [],
                    release_date: new Date(Date.now()),
                    price: 0,
                    platforms: [],
                    required_age: 0,
                    positive_ratings: 0,
                    negative_ratings: 0,
                    average_playtime: 0,
                    owners: 0,
                    total_ratings: 0,
                    diff_ratings: 0,
                    detailed_description: "Detailed description",
                    about_the_game: "About the game",
                    header_image: "https://steamcdn-a.akamaihd.net/steam/apps/0/header.jpg",
                    screenshots: [],
                    pc_requirements: {},
                    mac_requirements: {},
                    linux_requirements: {},
                    minimum: "Minimum requirements",
                    recommended: "Recommended requirements",
                    website: "https://store.steampowered.com/app/0",
                    support_email: "https://support.steampowered.com"
                },
            }).then(
                function (response) {
                    console.log("hola, todo ok", response);
                    $location.path("/game/" + response.data.appid);
                },
                function errorCallback(response) {
                    console.log("hola, todo mal!!", response);
                }
            );
        };
        
        $scope.gotoMain = function () {
            $location.path("/").search({});
            window.scrollTo(0, 0);
        };

        $scope.gotoGame = function (appid) {
            $location.path("/game/" + appid);
            window.scrollTo(0, 0);
        };
        
        $scope.gotoSearch = function () {
            $location.path("/search").search({});
            window.scrollTo(0, 0);
        };
        
        $scope.gotoCategory = function (category) {
            $location.path("/search").search("category", category);
            window.scrollTo(0, 0);
        };

        $scope.gotoGenre = function (genre) {
            $location.path("/search").search("genre", genre);
            window.scrollTo(0, 0);
        };

        $scope.updateUserType = function() {
            userService.setUserType($scope.userType);
        };
        
        $scope.showCatDropdown = false;
        $scope.showGenreDropdown = false;
        $scope.showFeaturedDropdown = false;
        $scope.userType = userService.getUserType();
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

      $scope.scrollToTop = function () {
        // Espera 100 milisegundos antes de realizar el desplazamiento
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 100);
      };

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
  $scope.minPrice = 0;
  $scope.reverse = false;
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
        minPrice: $scope.minPrice,
        maxPrice: $scope.maxPrice,
        reverse: $scope.reverse,
        propertyName: $scope.propertyName,
        page: $scope.currentPage,
        limit: $scope.resultsPerPage
      },
    }).then(
      function (response) {
        $scope.games = response.data.games;
        $scope.cantidadResultados = response.data.cantidadResultados;
        $scope.game = {};

        $scope.currentPage = response.data.paginaActual;
        if ($scope.cantidadResultados === 0){
          $scope.totalPages = 1;
        } else {
          $scope.totalPages = Math.ceil($scope.cantidadResultados / $scope.resultsPerPage);
        }
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
        params: {
            propertyName: $scope.propertyName,
            page: $scope.currentPage,
            limit: $scope.resultsPerPage
        }
        }).then(
        function (response) {
            $scope.cantidadResultados = response.data.cantidadResultados;
            $scope.currentPage = response.data.paginaActual;
            $scope.tags = response.data.tags.map(function (tag) {
                return { name: tag, checked: false };
            });
            $scope.genres = response.data.genres.map(function (genre) {
                return { name: genre, checked: false };
            });
            $scope.categories = response.data.categories.map(function (category) {
                return { name: category, checked: false };
            });
           // refresh();
        },
        function errorCallback(response) {
            console.log("hola, todo mal!!", response);
        }
    );
  };

  $scope.options = [
    { value: 'name', label: 'Nombre' },
    { value: 'release_date', label: 'Fecha de lanzamiento' },
    { value: 'price', label: 'Precio' }
  ];

  $scope.propertyName = $scope.options[0].value;

  $scope.resultsPerPage = 50;
  $scope.currentPage = 1;
  $scope.totalPages = 1;

  $scope.scrollToTop = function() {
      $window.scrollTo(0, 0);
    };

  $scope.previousPage = function() {
    scrollToTop();
    $scope.currentPage--;
    refresh();
  };

  $scope.nextPage = function() {
    scrollToTop();
    $scope.currentPage++;
    refresh();
  };

  $scope.getTranslatedLabel = function (value) {
    // Función para obtener la traducción de la etiqueta según el valor
    const option = $scope.options.find(option => option.value === value);
    return option ? option.label : value;
  };

  $scope.cleanSearch= function (){
    $scope.search = '';
    refresh();
  }

  $scope.cleanFilters= function (){
    $scope.filters = [[], [], []];
    for (let i = 0; i < $scope.categories.length; i++) {
      $scope.categories[i].checked = false;
    }
  
    for (let i = 0; i < $scope.genres.length; i++) {
      $scope.genres[i].checked = false;
    }
  
    for (let i = 0; i < $scope.tags.length; i++) {
      $scope.tags[i].checked = false;
    }
    refresh();
  }

  $scope.search = "";
  $scope.filters = [[], [], []];

  $scope.lims = [7, 7, 7];

  initSearch();

  $scope.sortBy = function () {
    $scope.currentPage = 1;
    refresh();
  };

  $scope.reverseFunction = function() {
    $scope.reverse = !$scope.reverse;
    $scope.currentPage = 1;
    refresh();
  };

  $scope.searchBy = function () {
    console.log("refresh2");
    $scope.currentPage = 1;
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
    $scope.currentPage = 1;
    console.log("refresh4");
    refresh();
  };
    $scope.filterByPrice = function () {
        console.log("refresh5");
        $scope.currentPage = 1;
        refresh();
    };
})
.controller("gameCtrl", function ($scope, $http, $location, $routeParams, $sce, ngDialog, userService) {
    var refresh = function () {
        $http({
          method: "GET",
          url: "/game/" + $routeParams.game,
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                $scope.game = response.data;

                $scope.percentage = ($scope.game.positive_ratings / $scope.game.total_ratings) * 100;

                $scope.fullStars = Math.floor($scope.percentage / 20);
                $scope.halfStars = $scope.percentage % 20 >= 10 ? 1 : 0;
                $scope.emptyStars = 5 - $scope.fullStars - $scope.halfStars;
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
        $http({
            method: "GET",
            url: "/game/" + $routeParams.game + "/reviews",
          }).then(
              function (response) {
                  console.log("hola, todo ok consegui las reviews", response);
                  $scope.reviews = response.data;
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
    $scope.isUserAdmin = function() {
        return userService.getUserType() == "admin";
    };

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

    var createReq = function(data) {
        $http({
            method: "PUT",
            url: "/game/" + $routeParams.game,
            data: data
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
            }
        );
    };

    $scope.cleanReq = function() {
        if ($scope.pcReq) {
            createReq({"pc_requirements": {}});
        } else if ($scope.macReq) {
            createReq({"mac_requirements": {}});
        } else if ($scope.linuxReq) {
            createReq({"linux_requirements": {}});
        };
        $scope.showPcReq();
    };

    $scope.showPcReq = function() {
        $scope.pcReq = true;
        $scope.macReq = false;
        $scope.linuxReq = false;

        if (!$scope.game.pc_requirements) {
            createReq({"pc_requirements": {}});
        };
    };

    $scope.showMacReq = function() {
        $scope.pcReq = false;
        $scope.macReq = true;
        $scope.linuxReq = false;

        if (!$scope.game.mac_requirements || $scope.game.mac_requirements.length === 0) {
            createReq({"mac_requirements": {}});
        };
    };

    $scope.showLinuxReq = function() {
        $scope.pcReq = false;
        $scope.macReq = false;
        $scope.linuxReq = true;

        if (!$scope.game.linux_requirements || $scope.game.linux_requirements.length === 0) {
            createReq({"linux_requirements": {}});
        };
    };

    $scope.getStarsArray = function(num) {
        // Devuelve un array con el número de elementos igual a num
        return new Array(num);
    };

    $scope.deleteGame = function() {
        $http({
            method: "DELETE",
            url: "/game/" + $routeParams.game,
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
        $location.path("/");
    };

    $scope.deleteReview = function(review_id) {
        $http({
            method: "DELETE",
            url: "/game/" + $routeParams.game + "/reviews/" + review_id,
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                refresh();
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
    };

    $scope.showEditReviewModal = function(review) {
        $scope.review = review;
        ngDialog.open({
            template: 'views/review-modal.html', // Define una plantilla para la ventana modal
            controller: 'reviewCtrl', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };

    $scope.showReviewModal = function() {
        $scope.review = "";
        ngDialog.open({
            template: 'views/review-modal.html', // Define una plantilla para la ventana modal
            controller: 'reviewCtrl', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };

    $scope.showDialogEditTitle = function() {
        ngDialog.open({
            template: 'views/dialog-edit-title.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };

    $scope.showDialogEditShortDesc = function() {
        $scope.carKey = "short_description";
        $scope.carValues = $scope.game.short_description;
        ngDialog.open({
            template: 'views/dialog-edit-textarea.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditDescription = function() {
        $scope.carKey = "detailed_description";
        $scope.carValues = $scope.game.detailed_description;
        ngDialog.open({
            template: 'views/dialog-edit-textarea.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditCat = function() {
        $scope.carKey = "categories";
        $scope.carValues = angular.copy($scope.game.categories);
        ngDialog.open({
            template: 'views/dialog-edit-caracteristics.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditGenre = function() {
        $scope.carKey = "genres";
        $scope.carValues = angular.copy($scope.game.genres);
        ngDialog.open({
            template: 'views/dialog-edit-caracteristics.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditTag = function() {
        $scope.carKey = "steamspy_tags";
        $scope.carValues = angular.copy($scope.game.steamspy_tags);
        ngDialog.open({
            template: 'views/dialog-edit-caracteristics.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditPlatforms = function() {
        $scope.carKey = "platforms";
        $scope.carValues = angular.copy($scope.game.platforms);
        ngDialog.open({
            template: 'views/dialog-edit-caracteristics.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditDeveloper = function() {
        $scope.carKey = "developer";
        $scope.carValues = angular.copy($scope.game.developer);
        ngDialog.open({
            template: 'views/dialog-edit-text-multi.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditPublisher = function() {
        $scope.carKey = "publisher";
        $scope.carValues = angular.copy($scope.game.publisher);
        ngDialog.open({
            template: 'views/dialog-edit-text-multi.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditReleaseDate = function() {
        ngDialog.open({
            template: 'views/dialog-edit-date.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    }
    $scope.showDialogEditRequiredAge = function() {
        ngDialog.open({
            template: 'views/dialog-edit-required-age.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditPrice = function() {
        ngDialog.open({
            template: 'views/dialog-edit-price.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditHeaderImage = function() {
        ngDialog.open({
            template: 'views/dialog-edit-header-image.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditRequirements = function(key1, key2) {
        $scope.carKey = key1 + "." + key2;
        $scope.carValues = angular.copy($scope.game[key1][key2]);
        ngDialog.open({
            template: 'views/dialog-edit-textarea.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
    $scope.showDialogEditScreenshots = function() {
        ngDialog.open({
            template: 'views/dialog-edit-screenshots.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };
})
.controller("reviewCtrl", function ($scope, $http, $routeParams, ngDialog) {
    if ($scope.review) {
        $scope.reviewer = $scope.review.name;
        $scope.title = $scope.review.title;
        $scope.descripcion = $scope.review.text;
        $scope.recomendado = $scope.review.recommend;
    } else {
        $scope.reviewer = "";
        $scope.title = "";
        $scope.descripcion = "";
        $scope.recomendado = true;
    };

    $scope.addReview = function () {
        // Agregar lógica para procesar la reseña
        $http({
            method: "POST",
            url: "/game/" + $routeParams.game + "/reviews",
            data: {
                name: $scope.reviewer,
                title: $scope.title,
                text: $scope.descripcion,
                recommend: $scope.recomendado,
                date: new Date(Date.now())
            },
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                $scope.reviews.push(response.data);
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
        ngDialog.closeAll();
    };

    $scope.editReview = function () {
        // Agregar lógica para procesar la reseña
        $http({
            method: "PUT",
            url: "/game/" + $routeParams.game + "/reviews/" + $scope.review.review_id,
            data: {
                name: $scope.reviewer,
                title: $scope.title,
                text: $scope.descripcion,
                recommend: $scope.recomendado,
                date: new Date(Date.now())
            },
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                refresh();
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
        ngDialog.closeAll();
    };

    $scope.toggleRecomendado = function() {
        $scope.recomendado = !$scope.recomendado;
        console.log("Recomendado = " +  $scope.recomendado);
    };
})
.controller("gameEdit", function ($scope, $http, $routeParams, ngDialog) {
    $scope.edit = function (carKey, carValues) {
        var data = {};
        data[carKey] = carValues;
        $http({
            method: "PUT",
            url: "/game/" + $routeParams.game,
            data: data,
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                //data is {'<feature>': <value>}, update with relfection
                // feature could be nested by dots
                var keys = carKey.split(".");
                var obj = $scope.game;
                for (var i = 0; i < keys.length - 1; i++) {
                    obj = obj[keys[i]];
                };
                obj[keys[keys.length - 1]] = carValues;
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
        ngDialog.closeAll();
    };
    $scope.name = $scope.game.name;
    $scope.date = $scope.game.release_date;
    $scope.price = $scope.game.price;
    $scope.headerImage = $scope.game.header_image;
    $scope.requiredAge = $scope.game.required_age;
    var ageRangeMap = [0, 3, 7, 12, 16, 18];
    $scope.ageRange = ageRangeMap.indexOf($scope.requiredAge);
    $scope.screenshots = $scope.game.screenshots;

    if ($scope.carKey == "categories" || $scope.carKey == "genres" || $scope.carKey == "steamspy_tags") {
        $http({
            method: "GET",
            url: "/" + $scope.carKey,
        }).then(
            function (response) {
                console.log("hola, todo ok", response);
                $scope.caracteristics = response.data.map(function (car) {
                    return { name: car, checked: false };
                });

                for (let i = 0; i < $scope.carValues.length; i++) {
                    for (let j = 0; j < $scope.caracteristics.length; j++) {
                        if ($scope.caracteristics[j].name == $scope.carValues[i]) {
                            $scope.caracteristics[j].checked = true;
                            break;
                        }
                    }
                }
            },
            function errorCallback(response) {
                console.log("hola, todo mal!!", response);
            }
        );
    } else if ($scope.carKey == "platforms") {
        $scope.caracteristics = [
            { name: "windows", checked: $scope.carValues.includes("windows") },
            { name: "mac", checked: $scope.carValues.includes("mac") },
            { name: "linux", checked: $scope.carValues.includes("linux") }
        ];
    };

    $scope.toggleCaracteristic = function (car) {
        car.checked = !car.checked;
        if (car.checked) {
            $scope.carValues.push(car.name);
        } else {
            var index = $scope.carValues.indexOf(car.name);
            $scope.carValues.splice(index, 1);
        }
    };

    $scope.delete = function (car) {
        var index = $scope.carValues.indexOf(car);
        $scope.carValues.splice(index, 1);
    };

    $scope.add = function (car) {
        $scope.carValues.push(car);
        $scope.car = "";
    };

    $scope.updateAgeRange = function() {
        $scope.requiredAge = ageRangeMap[$scope.ageRange];
    };

    $scope.editScreenshot = function (index) {
        $scope.screenshotIndex = index;
        $scope.pathThumbnail = $scope.screenshots[index].path_thumbnail;
        $scope.pathFull = $scope.screenshots[index].path_full;
        ngDialog.open({
            template: 'views/dialog-edit-screenshot.html', // Define una plantilla para la ventana modal
            controller: 'gameEdit', // Define un controlador para la ventana modal
            scope: $scope, // Usa el scope actual de este controlador para la ventana modal
            className: 'ngdialog-theme-default', // Define una clase CSS para la ventana modal
        });
    };

    $scope.saveScreenshot = function () {
        $scope.screenshots[$scope.screenshotIndex].path_thumbnail = $scope.pathThumbnail;
        $scope.screenshots[$scope.screenshotIndex].path_full = $scope.pathFull;
        $scope.edit("screenshots", $scope.screenshots);
    };
});