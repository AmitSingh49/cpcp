// Delete all faces from collection
function DeleteAllFacesFromCollection(collectionName) {
    AnonLog();
    AWS.region = "us-east-1";
    var rekognition = new AWS.Rekognition();
    var params = {
        CollectionId: collectionName,//collectionname
        MaxResults: 20
    };
    rekognition.listFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            var faceIds = [];
            for (var i = 0; i < data.Faces.length; i++) {
                faceIds.push(data.Faces[i].FaceId);
            }
            deletefacefromCollection(faceIds, collectionName);
        }            // successful response
    });

}

function DeleteFaceFromCollection(faceId, collectionName) {
    var faceIds = [];
    faceIds.push(faceId);
    deletefacefromCollection(faceIds, collectionName);
}

//deletes all face ids from collection
function deletefacefromCollection(faceIds, collectionId) {
    AnonLog();
    AWS.region = "us-east-1";
    var rekognition = new AWS.Rekognition();
    var params = {
        CollectionId: "test_recognition",
        FaceIds: faceIds
    };
    rekognition.deleteFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
        /*
        data = {
         DeletedFaces: [
            "ff43d742-0c13-5d16-a3e8-03d3f58e980b"
         ]
        }
        */
    });
}

//Provides anonymous log on to AWS services
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
    var criminalRecord = { name: "DEV", faceId: "123", email: 'c@c.com' };
    //obj = JSON.parse(text);
    localStorage.setItem(criminalRecord.faceId, JSON.stringify(criminalRecord));
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