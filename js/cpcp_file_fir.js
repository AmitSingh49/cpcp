$(window).on('load', function () {
	var criminalData = {};
	if(localStorage.getItem('criminalRecord')){
		criminalData = localStorage.getItem('criminalRecord');
	}
	
	$('.home-camera-overlay').fadeIn(function(){
		Webcam.attach('.home-camera');
		Webcam.on( 'load', function() {
			Webcam.snap(function(data_uri) {
			AnonLog();	
			checkCriminalInDB(data_uri);
			//$('.file-fir-photo').attr("src", data_uri);
			//$('.home-camera-overlay').fadeOut();
			//$('.file-fir').show();
			});
		});
	});	
	
	function checkCriminalInDB(data_uri){
		if(localStorage.getItem('criminalRecord')){
			criminalData = localStorage.getItem('criminalRecord');
		}
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
			CollectionId: "cpcp_criminalRecords",
			DetectionAttributes:[],
			ExternalImageId: "Criminal1",
			Image:{
				Bytes: imageBytes,
			}
		}; 
		
		var CollectionParams= {
			CollectionId: "cpcp_criminalRecords",
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
					$('.file-fir').show();
				} 
				else if (data.FaceDetails.length > 1){
					$('.home-camera-overlay').fadeOut();
					$('.home-login-error').text("Please try with only one person in front of camera").fadeIn();
					$('.file-fir').show();
				}
				else{
					rekognition.searchFacesByImage(CollectionParams, function (err, dataSearch) {
						if (err){
							$('.home-camera-overlay').fadeOut();
							$('.home-login-error').text(err.message).fadeIn();
							$('.file-fir').show();
						} 
						else{
							if(dataSearch.FaceMatches.length > 0){
								debugger;
								var existingFaceId = dataSearch.FaceMatches[0].Face.FaceId;
								if(criminalData[existingFaceId] === undefined){
									criminalData[existingFaceId] = {};
								}
								localStorage.setItem('criminalRecord', JSON.stringify(criminalData));
								$('.home-camera-overlay').fadeOut();
								$('.home-login-error').text("Criminal already exists").fadeIn();
								$('.file-fir').show();
							}
							else{
								debugger;
								rekognition.indexFaces(params, function (err, dataAddToDB) {
									if (err){
										$('.home-camera-overlay').fadeOut();
										$('.home-login-error').text(err.message).fadeIn();
										$('.file-fir').show();
									} 
									else{
										var newfaceId = dataAddToDB.FaceRecords[0].Face.FaceId;
										if(!criminalData[newfaceId]){
											criminalData[newfaceId] = {};
										}	
										localStorage.setItem('criminalRecord', JSON.stringify(criminalData));
										$('.home-camera-overlay').fadeOut();
										$('.home-login-error').text('Criminal added Successfully').addClass('success').fadeIn();
										$('.file-fir').show();
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
	
	//change to match
	function AddToLocalStorage(criminalData) {
		//var criminalRecord = { name: "DEV", faceId: "123", email: 'c@c.com' };
		//obj = JSON.parse(text);
		localStorage.setItem(criminalRecord, JSON.stringify(criminalRecord));
	}

	//change to match
	function GetFromLocalStorage(faceId) {
		//var criminalRecord = { name: "DEV", faceId: "123", email: 'c@c.com' };
		//obj = JSON.parse(text);
		 return localStorage.getItem(keyName);
	}

	//change to match
	function DeleteToLocalStorage(criminalData) {
		var criminalRecord = { name: "DEV", faceId: "123", email: 'c@c.com' };
		//obj = JSON.parse(text);
		localStorage.removeItem(criminalRecord.faceId);
	}


});


