 .controller('AboutController', ['$scope', 'corporateFactory','baseURL', function($scope, corporateFactory, baseURL) {
                    $scope.baseURL = baseURL;
                    $scope.leaders = corporateFactory.query();
                    console.log($scope.leaders);
            
                    }])
;