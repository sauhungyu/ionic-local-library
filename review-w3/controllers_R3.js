angular.module('conFusion.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$localStorage','$ionicPlatform', '$cordovaCamera', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  $scope.reservation = $localStorage.getObject('reservation', '{}');
  $scope.registration = $localStorage.getObject('registration', '{}');
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(res){
    $scope.registerform = res;
  });

  $scope. closeRegister = function(){
    $scope.registerform.hide();
  };
  $scope.doRegister = function(){
    console.log('Doing Registrationg', $scope.registerform);
    $timeout(function(){
      $scope.closeRegister();
    }, 1000)
  }

  $scope.register = function(){
    $scope.registerform.show();
  }
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  }

  $scope.reserve = function() {
    $scope.reserveform.show();
  }

  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);


    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };

  $ionicPlatform.ready(function(){
      Camera = {};
      Camera.DestinationType={DATA_URL: 1};
      Camera.PictureSourceType= {CAMERA:2};
      Camera.EncodingType={JPEG:3};
      CameraPopoverOptions=1;
    console.log($cordovaCamera);
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    };

    $scope. takePicture = function(){
      $cordovaCamera.getPicture(options).then(function(data){
        $scope.registration.imgSrc = "data:image/jpeg;base64," + data;
      },
      function(err){
        console.log(err);
      }
    );
  };

  });


}])

.controller('MenuController', ['$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 'baseURL', '$scope', 'dishes', 'favoriteFactory', '$ionicListDelegate', function($ionicPlatform, $cordovaLocalNotification, $cordovaToast, baseURL, $scope, dishes, favoriteFactory, $ionicListDelegate) {
  $scope.baseURL = baseURL;
  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;
  $scope.showMenu = false;
  $scope.message = "Loading ...";
  $scope.dishes = dishes;


  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if (setTab === 2) {
      $scope.filtText = "appetizer";
    } else if (setTab === 3) {
      $scope.filtText = "mains";
    } else if (setTab === 4) {
      $scope.filtText = "dessert";
    } else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function(checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };

  $scope.addFavorite = function(index) {
    console.log("index is " + index);
    favoriteFactory.addToFavorites(index);
    $ionicListDelegate.closeOptionButtons();

    $ionicPlatform.ready(function() {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: "Added Favorite",
        text: $scope.dishes[index].name,
      }).then(function(res) {
          console.log('Added Favorite ' + $scope.dishes[index].name);
        },
        function(res) {
          console.log('Failed to add Favorite ');
        });

      $cordovaToast.show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
        .then(function(res) {

          },
          function(res) {

          });
    });

  };
}])

.controller('ContactController', ['$scope', function($scope) {

  $scope.feedback = {
    mychannel: "",
    firstName: "",
    lastName: "",
    agree: false,
    email: ""
  };

  var channels = [{
    value: "tel",
    label: "Tel."
  }, {
    value: "Email",
    label: "Email"
  }];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

  $scope.sendFeedback = function() {

    console.log($scope.feedback);

    if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
      $scope.invalidChannelSelection = true;
      console.log('incorrect');
    } else {
      $scope.invalidChannelSelection = false;
      feedbackFactory.save($scope.feedback);
      $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
      };
      $scope.feedback.mychannel = "";
      $scope.feedbackForm.$setPristine();
      console.log($scope.feedback);
    }
  };
}])

.controller('DishDetailController', ['baseURL', '$scope', '$stateParams', 'dish', 'menuFactory', '$ionicPopover', 'favoriteFactory', '$ionicModal', function(baseURL, $scope, $stateParams, dish, menuFactory, $ionicPopover, favoriteFactory, $ionicModal) {
  $scope.baseURL = baseURL;
  $scope.dish = {};
  $scope.showDish = false;
  $scope.message = "Loading ...";
  $scope.dish = menuFactory.get({
      id: parseInt($stateParams.id, 10)
    })
    .$promise.then(
      function(response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );

  $ionicPopover.fromTemplateUrl(
    '/templates/dish-detail-popover.html', {
      scope: $scope
    }).then(
    function(result) {
      $scope.popover = result;
    },
    function(result) {}
  );
  $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.commentForm = modal;
  });

  $scope.addFavorite = function(id) {
    favoriteFactory.addToFavorites(id);
    $scope.popover.hide;
    console.log(id);
  }
  $scope.addComment = function(id) {
    $scope.commentForm.show();
    $scope.popover.hide();
    console.log(id);
  }
  $scope.closeComment = function() {
    $scope.commentForm.hide();
  }


}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.mycomment = {
    rating: 5,
    comment: "",
    author: "",
    date: ""
  };

  $scope.submitComment = function() {

    $scope.mycomment.date = new Date().toISOString();
    console.log($scope.mycomment);

    $scope.dish.comments.push($scope.mycomment);
    menuFactory.update({
      id: $scope.dish.id
    }, $scope.dish);

    $scope.commentForm.$setPristine();

    $scope.mycomment = {
      rating: 5,
      comment: "",
      author: "",
      date: ""
    };

    if ($scope.closeComment != undefined) {
      $scope.closeComment();
    }
  }
}])

// implement the IndexController and About Controller here

.controller('IndexController', ['baseURL', '$scope', 'dish', 'leader', 'promotion', function(baseURL, $scope, dish, leader, promotion) {
  $scope.baseURL = baseURL;
  $scope.leader = leader;
  $scope.dish = dish;
  $scope.message = "Loading ...";
  $scope.promotion = promotion;

}])

.controller('AboutController', ['baseURL', '$scope', 'leaders', function(baseURL, $scope, leaders) {
  $scope.baseURL = baseURL;
  $scope.leaders =  leaders;
  console.log($scope.leaders);

}])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {
  $scope.baseURL = baseURL;
  $scope.shouldShowDelete = false;
  $ionicLoading.show({
    template: "<ion-spinner></ion-spinner> Loading..."
  });
  $scope.favorites = favorites;
  $scope.dishes = dishes;
  $timeout(function() {
    $ionicLoading.hide();
  }, 1000);
  // menuFactory.query(
  //   function (response) {
  //           $scope.dishes = response;
  //       },
  //       function (response) {
  //           $scope.message = "Error: " + response.status + " " + response.statusText;
  //       }
  // );

  console.log($scope.dishes, $scope.favorites);

  $scope.toggleDelete = function() {
    $scope.shouldShowDelete = !$scope.shouldShowDelete;
    console.log($scope.shouldShowDelete);
  };

  $scope.deleteFavorite = function(index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm Delete',
      template: 'Are you sure you want to delete this item?'
    }).then(function(res) {
      if (res) {
        console.log('Ok to delete');
        favoriteFactory.deleteFromFavorites(index);
      } else {
        console.log('Canceled delete');
      }
    });
  };


}])

.filter('favoriteFilter', function() {
  return function(dishes, favorites) {
    var out = [];
    for (var i = 0; i < favorites.length; ++i) {
      for (var j = 0; j < dishes.length; ++j) {
        if (dishes[j].id === favorites[i].id)
          out.push(dishes[j]);
      }
    }
    return out;
  };
})

;