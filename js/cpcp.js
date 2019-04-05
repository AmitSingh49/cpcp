$(document).ready(function(){
	$('.home-login').click(function(){
		$('.home-camera-overlay,').fadeIn(function(){
			Webcam.attach( '.home-camera' );
			$('.home-login-error').text('').fadeOut();
		});
	});
	$('.home-register').click(function(){
		window.location.href = 'C:/Users/vijay/Desktop/CPCP/cpcp_registration.html';
	});
	
	Webcam.on( 'live', function() {
		AnonLog();
		Webcam.snap( function(data_uri){
			var image = null;
			var jpg = true;
			try {
			  image = atob(data_uri.split("data:image/jpeg;base64,")[1]);
			}
			catch (e) {
			  jpg = false;
			}
			if (jpg == false) {
				try{
					image = atob(data_uri.split("data:image/png;base64,")[1]);
				}
				catch (e) {
					console.log("Not an image file Rekognition can process");
					return;
				}
			}
			var length = data_uri.length;
			var imageBytes = new ArrayBuffer(length);
			var ua = new Uint8Array(imageBytes);
			for (var i = 0; i < length; i++) {
				ua[i] = image.charCodeAt(i);
			}
			
			var noOfHumansParams= {
				Image:{
					Bytes: imageBytes,
				}
			};
			var CollectionParams= {
				CollectionId: "test_recognition",
				FaceMatchThreshold:95,
				Image:{
				Bytes: imageBytes,
				},
				MaxFaces:5
			};
			AWS.region = "us-east-1";
			var rekognition = new AWS.Rekognition();
			
			rekognition.detectFaces(noOfHumansParams, function (err, data) {
				if (err){
					$('.home-camera-overlay').fadeOut();
					
					$('.home-login-error').text(err.message).fadeIn();
				} 
				else if (data.FaceDetails.length > 1){
					$('.home-camera-overlay').fadeOut();
					$('.home-login-error').text("Please try with only one person in front of camera").fadeIn();
				}
				else{
					rekognition.searchFacesByImage(CollectionParams, function (err, dataLogin) {
						if (err){
							console.log(err, err.stack);
							$('.home-login-error').text(err.message).fadeIn();	
						} 
						else{
							if(dataLogin.FaceMatches.length === 1){
								window.location.href = 'C:/Users/vijay/Desktop/CPCP/cpcp_landing.html';
							}
							else{
								$('.home-camera-overlay').fadeOut();
								$('.home-login-error').text("You don't have permission to login the system").fadeIn();
							}
						}
					});
				}
			});	
		});
	});

	function AnonLog() {
    // Configure the credentials provider to use your identity pool
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:4d4397ce-dddc-48d3-962e-4bc72ea56d7f',
    });
    // Make the call to obtain credentials
    AWS.config.credentials.get(function () {
      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
    });
  }
  

});



