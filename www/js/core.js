// ons.disableAutoStatusBarFill(); - Disable the status bar margin.
var app = angular.module('app', ['onsen', 'angular-carousel', 'ngMap']);

app.directive('datePicker', function () {
    return {
        link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.datePicker, function () {
                if (attrs.datePicker === 'start') {
                    //element.pickadate();
                }
            });
        }
    };
});

// Map Markers Controller

app.controller('markersController', function($scope, $compile){
	
	$scope.infoWindow = {
		title: 'title',
		content: 'content'
	};

	$scope.markers = [
		{
			'title' : 'Streetmoja',
			'content' : 'R and M (R&M) Uganda,Rofra House ,4th floor , Suite 7,Plot 546 , Ggabba Road. Kampala.',
			'location'	: [0.284597, 32.608403]
		}
		
    ];

    $scope.showMarker = function(event){

		$scope.marker = $scope.markers[this.id];
    	$scope.infoWindow = {
			title: $scope.marker.title,
			content: $scope.marker.content
		};
		$scope.$apply();
		$scope.showInfoWindow(event, 'marker-info', this.getPosition());
    }

});


// Plugins Controller

app.controller('pluginsController', function($scope, $compile){

    $scope.openWebsite = function(){
		var ref = window.open('http://m.streetmoja.com/', '_blank', 'location=no', 'toolbar=no');
		ref.addEventListener('loadstart', function() { alert('start: ' + event.url); });
     ref.addEventListener('loadstop', function() { alert('stop: ' + event.url); });
     ref.addEventListener('exit', function() { alert(event.type); });
    }
    
    $scope.openWebsites = function(){
		var ref = window.open('http://streetmoja.com/', '_blank', 'location=no');
    }


    $scope.openSocialSharing = function(){
		
		window.plugins.socialsharing.share('Message, image and link','To buy n sell visit' , null, 'http://streetmoja.com');

		/*
		 * 	Social Sharing Examples
		 * 	For more examples check the documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
 
			window.plugins.socialsharing.share('Message only')
			window.plugins.socialsharing.share('Message and subject', 'The subject')
			window.plugins.socialsharing.share(null, null, null, 'http://www.google.com')
			window.plugins.socialsharing.share('Message and link', null, null, 'http://www.google.com')
			window.plugins.socialsharing.share(null, null, 'https://www.google.com/images/srpr/logo4w.png', null)
			window.plugins.socialsharing.share('Message and image', null, 'https://www.google.com/images/srpr/logo4w.png', null)
			window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.com/images/srpr/logo4w.png', 'http://www.google.com')
			window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.com/images/srpr/logo4w.png', 'http://www.google.com')
		*
		*/

	}


	$scope.openEmailClient = function(){

		ons.ready(function() {
			cordova.plugins.email.open({
			    to:      'han@solo.com',
			    subject: 'Hey!',
			    body:    'May the <strong>force</strong> be with you',
			    isHtml:  true
			});
		});

	}

	
	$scope.getDirectionsGoogle = function(){

		var ref = window.open('http://maps.google.com/maps?q=0.284597,32.608403', '_system', 'location=yes');

	}

	$scope.getDate = function(){
		
		var options = {
		  date: new Date(),
		  mode: 'date'
		};

		datePicker.show(options, function(date){
		  alert("date result " + date);  
		});

	}

});


// News Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('newsController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://dev.studio31.co/api/get_recent_posts';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.news-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(index){
			
		$rootScope.postContent = $scope.items[index];
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


}]);

app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	
	$scope.item = $rootScope.postContent;

	$scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);
