import React, {useState, useEffect} from 'react'
import { Markup } from 'interweave'
import './Card.css'
import "animate.css/animate.min.css";

import { AnimationOnScroll  } from 'react-animation-on-scroll';


export default function Card(props: any) {
  const [key, setKey] = useState<any>()
  const [value, setValue] = useState<any[]>([])
  let dat = props

  const parse = (table: any) => {

    let cle = Object.keys(table);
    let out = "<ul>"
    for(let one of cle){
      out+=`\n<li>${one} : ${table[one]}</li>\n`
    }
  return out+="</ul>"
  }
  
  const tpr = (data: any)=>{
  let tableKey = []
  let tableValue = []
  let index = Object.keys(data[0])
  for(let item of index){
      if(typeof(data[0][item]) == 'number'){
        tableKey.push(item)
        tableValue.push((data[0][item]));
     }else if(data[0][item].length){
      tableKey.push(item)
      let ok = ""
          for(let i=0; i<data[0][item].length; i++){
              ok += (parse(data[0][item][i]))
          } 
       tableValue.push(ok)
      }else{
        tableKey.push(item)
          tableValue.push(parse((data[0][item])));
      }
  }
  setKey(tableKey);
  setValue(tableValue)
  }

useEffect(()=>{
  if(dat){
    tpr(dat.datas);
  }
}, [dat])

  return (
    <> 
    
      {value.map((elt : any , index : number)=> (
          <div className='valueContainer'>
          <h6><Markup content={key[index]} /> :</h6> *
        <p><Markup content={(elt).toString()}/></p>
        </div> 
        ))}     
     
    </>
  )
}
