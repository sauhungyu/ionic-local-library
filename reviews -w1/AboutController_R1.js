 .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {
            
            $scope.baseURL = baseURL;
            $scope.showLeaders = false;
            $scope.message = "Loading...";
            
            $scope.leaders = corporateFactory.getLeaders().query(                
                function(response) {
                    $scope.leaders = response;
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        }])	 