// scenarios.mjs
export const scenarios={
 sample:{
  id:"sample",
  title:"Sample Scenario",
  description:"Demo scenario",
  injects:[
    {seq:1,time:"09:00",phase:"Intel",cues:{severity:"Low",impact:["Login"],phase:"Recon"},
     narrative:"Test narrative",
     decision:{question:"Test?",options:{A:"A",B:"B",C:"C"}}}
  ]
 }
};
