$(document).ready(function(){
	var newUserImage = '',
	newUserName ='' ;
	$('.reg-upload-photo').click(function(){
		$('.home-login-error').text('').fadeOut();
		$('.home-camera-overlay').fadeIn(function(){
			Webcam.attach( '.home-camera' );
		});
	});
	Webcam.on( 'live', function() {
		$('.reg-upload-photo').text('Re Take Photo');
		$('.reg-click-photo').fadeIn();
	});
	$('.reg-click-photo').click(function(){
		Webcam.snap( function(data_uri) {
			newUserImage = data_uri;
			$('.reg-photo').attr("src", '').fadeOut();
			$('.home-camera-overlay').fadeOut();
			$('.reg-click-photo').fadeOut();
			$('.reg-photo').attr("src", data_uri).fadeIn();
			$('.reg-register-btn').fadeIn();
		});
	});
	$('#reg-name').blur(function(){
		$('.home-login-error').text('').fadeOut();
		if($('#reg-name').val()){
			$('#reg-name').parent().removeClass('error');
			newUserName = $('#reg-name').val();
		}
	});
	
	$('.reg-register-btn').click(function(){
		$(this).attr('disabled', 'true');
		if(!$('#reg-name').val()){
			$('#reg-name').parent().addClass('error');
		}else{
			AnonLog();
			registerUser(newUserImage);
		}
	});
	
	function registerUser(data_uri){
	
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
		
		AWS.region = "us-east-1";
		var rekognition = new AWS.Rekognition();
	
		var params= {
		 CollectionId: "test_recognition",
		 DetectionAttributes:[],
		 ExternalImageId: newUserName,
		 Image:{
			Bytes: imageBytes,
		}};
		
		var CollectionParams= {
			CollectionId: "test_recognition",
			FaceMatchThreshold:95,
			Image:{
			Bytes: imageBytes,
			},
			MaxFaces:5
		};
		
		var noOfHumansParams= {
			Image:{
				Bytes: imageBytes,
			}
		};
			
		rekognition.detectFaces(noOfHumansParams, function (err, data) {
				if (err){
					$('.home-camera-overlay').fadeOut();
					$('.home-login-error').text(err.message).fadeIn();
					$(this).attr('disabled', 'false');
				} 
				else if (data.FaceDetails.length > 1){
					$('.home-camera-overlay').fadeOut();
					$('.home-login-error').text("Please try with only one person in front of camera").fadeIn();
					$(this).attr('disabled', 'false');
				}
				else{
					rekognition.searchFacesByImage(CollectionParams, function (err, dataLogin) {
						if (err){
							console.log(err, err.stack);
							$('.home-login-error').text(err.message).fadeIn();
							$(this).attr('disabled', 'false');
						} 
						else{
							if(dataLogin.FaceMatches.length > 0){
								$('.home-login-error').text("You are already registered").fadeIn();
								$(this).attr('disabled', 'false');
							}
							else{
								rekognition.indexFaces(params, function (err, data) {
									if (err){
										$('.home-login-error').text(err.message).removeClass('success').fadeIn();
										$(this).attr('disabled', 'false');
									} 
									else{
										$('.home-login-error').text('User Registered Successfully').addClass('success').fadeIn();
										$(this).attr('disabled', 'false');
										$('.reg-register-btn').fadeOut();
									}
								});	
							}
						}
					});
				}
			});		
	}

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



