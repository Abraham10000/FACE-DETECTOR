import React from 'react';
import logo from './logo.svg';
import './App.css';
import  {  RekognitionClient ,  CompareFacesCommand  }  from  "@aws-sdk/client-rekognition" ;
import { Header } from './Component/Header';
import AWS from 'aws-sdk';


function App() {

  return (
<>
  <div className="App">
    <Header/>
  </div>
</>
    
  );
}

export default App;

