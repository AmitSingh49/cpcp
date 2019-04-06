
$(window).on('load', function () {
	$('.home-camera-overlay').fadeIn(function(){
		Webcam.attach('.home-camera');
		Webcam.on( 'load', function() {
			Webcam.snap(function(data_uri) {
				newUserImage = data_uri;
			$('.crime-details-photo').attr("src", data_uri);
			$('.home-camera-overlay').fadeOut();
			$('.crime-details').show();
			AnonLog();
			registerUser(newUserImage);
		});
			
			function registerUser(data_uri){
				debugger;
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
					Attributes: [ "ALL" ],
					Image:{
					   Bytes: imageBytes,
				   }};
					   
				   rekognition.detectFaces(params, function (err, data) {
					if (err) console.log(err, err.stack); // an error occurred
				else {
				 var table = "<table><tr><th>Age Range Low</th>   <th>Age Range High</th></tr>";
				 var genderTable = "<table><tr><th>Gender</th>  </tr>";
				  // show each face and build out estimated age table
				  for (var i = 0; i < data.FaceDetails.length; i++) {
					table += '<tr><td>' + data.FaceDetails[i].AgeRange.Low +
					  '</td><td>' + data.FaceDetails[i].AgeRange.High + '</td></tr>';

					  genderTable += '<tr><td>' + data.FaceDetails[i].Gender.Value +
					  '</td></tr>';
				  }
				  table += "</table>";

				  genderTable += "</table>";
				  
				  document.getElementById("opResult").innerHTML = table;
				  document.getElementById("genderResult").innerHTML = genderTable;
				}
			});
		}
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
});
