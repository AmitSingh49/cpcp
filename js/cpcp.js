$(document).ready(function(){
	
	$('.home-login').click(function(){
		$('.home-camera-overlay').fadeIn(function(){
			Webcam.attach( '.home-camera' );
		});
	});
	
	Webcam.on( 'live', function() {
		AnonLog();
		Webcam.snap( function(data_uri){
			var image = null;
			var img = document.createElement('img');
			img.src = data_uri;
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
			imageBytes = new ArrayBuffer(length);
			var ua = new Uint8Array(imageBytes);
			for (var i = 0; i < length; i++) {
				ua[i] = image.charCodeAt(i);
			}

			var params= {
				CollectionId: "test_recognition",
				FaceMatchThreshold:95,
				Image:{
				Bytes: imageBytes,
				},
				MaxFaces:1
			};
			AWS.region = "us-east-1";
			var rekognition = new AWS.Rekognition();
			rekognition.searchFacesByImage(params, function (err, data) {
				if (err){
					console.log(err, err.stack);// an error occurred
				} 
				else{
					if(data.FaceMatches[0] == undefined){
						console.log("not found");
					}
					else{
						alert(data.FaceMatches[0].Face.ExternalImageId);
					}
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



