import  {  RekognitionClient ,  CompareFacesCommand  }  from  "@aws-sdk/client-rekognition" ;



import AWS from 'aws-sdk';
import atob from 'atob';
import { useState, useEffect } from "react";
import { setTextRange } from "typescript";
import Card from "./Card";
import { Loading } from "./Loading";
import "animate.css/animate.min.css";
import { AnimationOnScroll  } from 'react-animation-on-scroll';
import { getSize } from "./Cadre";






export function Header() {
  let [res , setRes ] = useState<any>();
  let [image , setImage ] = useState<any>();
let [show , setShow] = useState<boolean>(false); 
const [loading , setLoading] = useState<boolean>(false);
const [dataList, setDataList] = useState<any>()


    function ProcessImage() {
      setShow(true)

      setLoading(true)
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
            })   
      //    table += "</table>";
      //   const div = document.getElementById("opResult")!.innerHTML = table ;
            
        }
        setLoading(false)

      });
    }


   
function AnonLog() {
    
  // Configure the credentials provider to use your identity pool
  AWS.config.region = process.env.REACT_APP_ONE; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_TWO as string,
  });
}




let donner = JSON.stringify(res);
console.log(donner);



return (
<>
<div className="container">
<header className="header" >
    <h1 className="display-1">FACE DETECTOR</h1> <br />
    <input type="file" style={{width : "30%",marginBottom : "0%",marginLeft : "32.5%"}}  className="form-control" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={() => {
      ProcessImage();
}}/>    
  
</header> <br />
{show && <body>
<div className="card mb-3" id="data">
  <div className="row g-0" id="container">
    <div className="col-md-4" id="border" >
    <div className="contains">

      <img src={image}  className="img-fluid rounded-start" 
      alt="..." style={{borderRadius : "2%",height : "400px"}}
       onLoad={(e : any)=>{getSize(e , res)}}
      />
      <div className="cadre"></div>
    </div>
    </div>
    <div className="col-md-8" >
      <div className="card-body" >
        <div className="card-title">{
        loading? <Loading/> : res? <Card datas={res}/>:""}</div>
      </div>
    </div>
  </div>
</div>
</body>}
</div> 
</>

);
}





