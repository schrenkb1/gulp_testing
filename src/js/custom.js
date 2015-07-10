var app = angular.module("jsonViewer", []);

var MainController = function($scope, $http) {
  $scope.jsonData = function(url) {
        var info = $http.get(url, {cache: true}).success(function(response) {
        console.log(response);
        $scope.nowTemp = Math.round(response.main.temp) + ' \xB0 F';
        $scope.windSpeed = response.wind.speed;
        $scope.windDeg = response.wind.deg;
        $scope.code = response.weather[0].icon;
        $scope.description = response.weather[0].description;
        $scope.image = "http://openweathermap.org/img/w/" + $scope.code + ".png";
        //$scope.cod = response.list[0];
        $scope.progBar = 100;
    });
  };
  $scope.setCoordData = function(url) {
        var code = $http.get(url).success(function(response) {
        console.log(response);
        $scope.lat = response.latitude;
        $scope.lon = response.longitude;
        $scope.city = response.city;
        $scope.timezone = response.timezone;
        $scope.zipCode = response.postal_code;
        $scope.regionName = response.region_code;
        $scope.isp = response.isp;
        $scope.region = response.region;
        $scope.country = response.country;
        $scope.countryCode = response.country_code;
        $scope.currentWeather = "http://api.openweathermap.org/data/2.5/weather?lat=" + $scope.lat + "&lon=" + $scope.lon + "&mode=json&units=imperial";
        console.log($scope.currentWeather);
        $scope.sevenDay = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+ $scope.lat + "&lon=" + $scope.lon + "&mode=json&units=imperial&cnt=7";
        $scope.jsonData($scope.currentWeather);
        $scope.progBar = 75;
        $scope.progBarType = 'progress-bar progress-bar-success';
        //$scope.jsonData($scope.sevenDay);
    });
  };
  $scope.getLocationData = function(url) {
        var answer = $http.get(url).success(function(response) {
        console.log(response);
        $scope.ip = response.ip;
        $scope.getCoord = "http://www.telize.com/geoip/" + $scope.ip;
        $scope.progBar = 25;
        $scope.progBarType = 'progress-bar progress-bar-info';
        $scope.setCoordData($scope.getCoord);
    });
  };

  $scope.getLocationData("https://api.ipify.org/?format=json");

};

app.controller("MainController", ["$scope", "$http", MainController]);