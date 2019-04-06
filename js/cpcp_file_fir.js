$(window).on('load', function () {
	$('.home-camera-overlay').fadeIn(function(){
		Webcam.attach('.home-camera');
		Webcam.on( 'load', function() {
			Webcam.snap(function(data_uri) {
			$('.file-fir-photo').attr("src", data_uri);
			$('.home-camera-overlay').fadeOut();
			$('.file-fir').show();
			});
		});
	});	
});


