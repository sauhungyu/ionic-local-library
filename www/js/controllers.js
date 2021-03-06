angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};
    $scope.reservation = {};
	 $scope.registration = {};
	
    $scope.loginData = $localStorage.getObject('mystore', '{}');   // get userinfo key else then return empty object
        
   
     
    
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('mystore', $scope.loginData);
        
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };

    
//    $scope.registration = $localStorage.getObject('userinfo', '{}');   // get userinfo key else then return empty object
    
     // Create the register modal that we will use later
 //   $ionicModal.fromTemplateUrl('templates/register.html', {
 //       scope: $scope
 //   }).then(function (modal) {
  //      $scope.modal = modal;
 //   });

    // Triggered in the register modal to close it
  //  $scope.closeRegister = function () {
   //     $scope.modal.hide();
   // };

    // Open the register in modal
  //  $scope.register = function () {
  //      $scope.modal.show();
   // };

    // Perform the register in action when the user submits the register form
   // $scope.doRegister = function () {
    //    console.log('Doing register', $scope.registration);
    //    $localStorage.storeObject('userinfo', $scope.registration);
        
        // Simulate a register delay. Remove this and replace with your registration
        // code if using a register system
   //     $timeout(function () {
    //        $scope.closeRegister();
     //   }, 1000);
//    };
    
    
    
    
    
    
    
    
    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function () {
        $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function () {
        $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function () {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a reservation delay. Remove this and replace with your reservation
        // code if using a server system
        $timeout(function () {
            $scope.closeReserve();
        }, 1000);
    };
	
	
	
	
	
		
		
	
	
})

.controller('MenuController', ['$scope', 'dishes', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

<!-- 
    menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

  -->
  
  $scope.dishes = dishes; 


    $scope.select = function (setTab) {
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

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
		
		 $ionicPlatform.ready(function () {
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.dishes[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.dishes[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                });

                $cordovaToast
                  .show('Added Favorite '+$scope.dishes[index].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
        });
		
		
		
		
		
    }
        }])

.controller('ContactController', ['$scope', function ($scope) {

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

.controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

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

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'baseURL', '$ionicPopover', 'favoriteFactory',  '$ionicListDelegate', '$ionicModal' , '$timeout', '$localStorage', function ($scope, $stateParams, dish, menuFactory, baseURL, $ionicPopover, favoriteFactory, $ionicListDelegate, $ionicModal, $timeout, $localStorage) {
                                     
    $scope.baseURL = baseURL;
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = dish;


    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope,
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };

    
    
    
    
    $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
       
        $ionicListDelegate.closeOptionButtons();
        $scope.popover.hide();
    };
   
    // Form data for the addComment modal
   
     $scope.commentData = {};
    
    // Create the addComment modal that we will use later
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the addComment modal to close it
    $scope.closeAddComment = function () {
        $scope.modal.hide();
    };

    // Open the addComment modal
    $scope.addComment = function (index) {       
          
        console.log("index is " + index);     
        
        $scope.popover.hide();
        $scope.modal.show();
    };

   // Perform the addComment action when the user submits the addComment form
    
    $scope.doAddComment = function (index) {
       
     $scope.commentData.date = new Date().toISOString();   
       $scope.dish.comments.push($scope.commentData);                
       
        console.log('Adding Comment', $scope.commentData);
       
       
       $timeout(function () {
           $scope.closeAddComment();
       }, 1000);
                                          
       
    
   };
    
    
    
    
    
}])


// implement the IndexController and About Controller here


.controller('IndexController', ['$scope', 'dish', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function ($scope, dish, menuFactory, promotionFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({
        id: 3
    });
    $scope.showDish = false;
    $scope.message = "Loading ...";

	<!--
	$scope.dish = menuFactory.get({
            id: 0
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
	
 	-->
	
	$scope.dish = dish;
	
	
   $scope.promotion = promotionFactory.get({
       id: 0
			
    });

                    }])

.controller('AboutController', ['$scope', 'leader', 'leaders', 'corporateFactory', 'baseURL', function ($scope, leader, leaders, corporateFactory, baseURL) {
    $scope.baseURL = baseURL;
	
<!-- 	
    $scope.leader = corporateFactory.get({id:1});
    $scope.leaders = corporateFactory.query();
    console.log($scope.leaders);
-->
 $scope.leader = leader;
 
 $scope.leaders = leaders;
 
 
                    }])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    
     $scope.favorites = favorites;      
    
    $scope.dishes = dishes;   
    
     
    
    
    
    
    
    
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

    }
}])

.filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

    }
});