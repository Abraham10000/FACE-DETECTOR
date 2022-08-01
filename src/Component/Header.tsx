import  {  RekognitionClient ,  CompareFacesCommand  }  from  "@aws-sdk/client-rekognition" ;


import AWS from 'aws-sdk';
import atob from 'atob';
import { useState, useEffect } from "react";
import { setTextRange } from "typescript";
import Card from "./Card";




export function Header() {
  let [res , setRes ] = useState<any>();
  let [image , setImage ] = useState<any>();
let [other , setOther] = useState<any>(); 

    function ProcessImage() {
      AnonLog();
      var control = document?.getElementById("fileToUpload") as HTMLInputElement;
      var file = control.files![0] ;
      setImage(URL.createObjectURL(file))
      // Load base64 encoded image 
      var reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e :any) {
          var img = document.createElement('img');
          var image = null;
          img.src = e.target.result;
          var jpg = true;
          try {
            image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
  
          } catch (e) {
            jpg = false;
          }
          if (jpg == false) {
            try {
              image = atob(e.target.result.split("data:image/png;base64,")[1]);
            } catch (e) {
              alert("Not an image file Rekognition can process");
              return;
            }
          }
          //unencode image bytes for Rekognition DetectFaces API 
          var length = image!.length;
         const imageBytes = new ArrayBuffer(length);
          var ua = new Uint8Array(imageBytes);
          for (var i = 0; i < length; i++) {
            ua[i] = image!.charCodeAt(i);
          }
          //Call Rekognition  
          DetectFaces(imageBytes);
          };
      })(file);
      reader.readAsDataURL(file);
  }

  async  function DetectFaces(imageData:any) {
    
        const config = new AWS.Config({
            region : "eu-west-2"
        })
        var rekognition = new AWS.Rekognition();
        var params = {
          Image: {
            Bytes: imageData
          },
          Attributes: [
            'ALL',
          ]
      } 
      rekognition.detectFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
     //    var table = "<table><tr><th>Low</th><th>High</th><th>Gender</th></tr>";
          // show each face and build out estimated age table
            console.log(`Detected Faces For : ${imageData}`);
            data.FaceDetails?.forEach(response =>{
        /*   table += '<tr><td class="table">' + response.AgeRange?.Low +
            '</td><td>' + response.AgeRange?.High + '</td><td>'+ response.Gender?.Value+'</td></tr>' ; */
                let low = response.AgeRange?.Low
                let high = response.AgeRange?.High
                let gender = response.Gender?.Value;
            console.log(`The dected face is beetwen ${low} and ${high} years old`);
            console.log(gender);
             setRes(data.FaceDetails)
            // console.log(res);
            
            })
            
    
      //    table += "</table>";
      //   const div = document.getElementById("opResult")!.innerHTML = table ;
            
        }
      });
    }


   
function AnonLog() {
    
  // Configure the credentials provider to use your identity pool
  AWS.config.region = 'eu-west-2'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-2:371cdf1c-657e-4e3f-a6a0-3cdcf905bfdc',
  });
  // Make the call to obtain credentials
 /* AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials!.accessKeyId;
    var secretAccessKey = AWS.config.credentials!.secretAccessKey;
    var sessionToken = AWS.config.credentials!.sessionToken;
  }); */
}

useEffect(() => {
  if(res){
    let ex = ""
    for (let index = 0; index < res.length; index++) {
      
      ex += (res[index].AgeRange.Low + "and" + res[index].AgeRange.High) 
    }
    setOther(ex)
  }
}, [res])


return (
<>
<div className="container">
<header className="App-header">
    <h1>Age Estimator</h1>
    <input type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={() => {
      ProcessImage();
}}/>    
    <img src={image} alt="Aiza Leizy" />
    <p id="opResult">{JSON.stringify(res)}</p>

</header>
{/*<body>
  <div className="table">
    <div className="sary">
    </div>
    {res? <Card datas={res}/>:""}
  </div>
</body> */}
</div> 
</>

);
}





