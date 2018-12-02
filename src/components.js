function addFieldsInMultiTextBox(element,i, text){
    var lbl1 = new Konva.Label({
        x:i*25,
        y:0,
        id:'multitextfield'+parseInt(Math.random()*1000)
        
    })
    
    lbl1.add(new Konva.Tag({
        fill:'white'
    }));
     lbl1.add(new Konva.Rect({
        fill:'white',
        width:25,
        height:25,
        stroke:"black"
    }));
    var txt = " ";
    if(text){
        txt = text;
    }
    lbl1.add(new Konva.Text({
        fontSize:13,
        lineHeight:1.5,
        width:25,
        height:25,
        fontStyle:'bold',
        text:txt
    }));
    element.add(lbl1);
    return element;
}
function generateMultiTextField(x,y,id){
    var lbl = new Konva.Label({
        x:x,
        y:y,
        id:id,
        draggable:true

    })
    
    for(var i=0;i<10;i++){
        addFieldsInMultiTextBox(lbl,i," ")
    }
    lbl.add(new Konva.Tag({
        fill:'yellow'
    }));
     lbl.add(new Konva.Text({
        fontSize:13,
        fontWeight:"bold",
        text:"  "
    }));
   return lbl;
}

function generateDateField(x,y,id){
    var pattern = "DD-MMM-YYYY";

    var lbl = new Konva.Label({
        x:x,
        y:y,
        id:id,
        draggable:true

    })
    
    for(var i=0;i<pattern.length;i++){
        if(pattern[i] === "-"){
            lbl.add(new Konva.Text({
                fontSize:13,
                fontWeight:"bold",
                text:" "
            }));
        }else{
            addFieldsInMultiTextBox(lbl,i/*,pattern[i]*/)
        }
       
    }
    lbl.add(new Konva.Tag({
        fill:'yellow'
    }));
     lbl.add(new Konva.Text({
        fontSize:13,
        fontWeight:"bold",
        text:"  "
    }));
   return lbl;
}



function getElement(x,y,id,frmEleID,isVariable,e){
    var element = null;
    if(isVariable){
        if(e.currentTarget === stage){
         element = (new Konva.Text({
             x: x,
             y: y,
             id:id,
             fontFamily: 'Tahoma',
             fontSize: 13,
             text: '<<'+$(e.evt.fromElement).text()+">>",
             draggable:true,
             fill: 'black'
         }));
        }else if(e.target && e.target.nodeType === "Group"){
            console.log("It is a group")
        }

    }else  if(frmEleID==="labelField"){
     element = (new Konva.Text({
         x: x,
         y: y,
         id:id,
         fontFamily: 'Calibri',
         background:"white",
         fontSize: 13,
         fontStyle:'normal',
         text: 'Simple Text',
         draggable:true,
         fill: 'black'
     }));
    
    }else if(frmEleID==="rect"){
     element = (new Konva.Rect({
         x: x,
         y: y,
         id:id,
         width: 100,
         height: 100,
         draggable :true,
         fill: 'white',
         stroke: 'black',
         strokeWidth: 2,
         strokeScaleEnabled: false
     }));
    }else if(frmEleID === "multitextfield"){            
        element = (generateMultiTextField(x,y,id));
    }else if(frmEleID === "dateField"){
        element = generateDateField(x,y,id);
    }else if(frmEleID==="lineField"){            
     element = (new Konva.Line({
         points: [x, y, y, y],
         stroke: 'black',
         id:id,
         draggable:true,
         strokeWidth: 2,
         lineCap: 'round',
         lineJoin: 'round'
       }));
    }else if(frmEleID==="test"){            
     var test = new Konva.Label({
         x: 180,
         y: 150,
         opacity: 0.75,
         draggable:true,
         listening:true
     });
     test.setListening(true);
     layer.drawHit();
     test.add(new Konva.Tag({
         fill:"#AAA"
     }));
     

     test.add(new Konva.Text({
         text: '     ',
         fontFamily: 'Calibri',
         fontSize: 18,
         id:id,
         padding: 5,
         fill: 'black'
     }));

     element = (test);
    }else if(frmEleID==="groupField"){
     var simpleLabel = new Konva.Label({
         x: 180,
         y: 150,
         opacity: 0.75,
         draggable:true
     });

     simpleLabel.add(new Konva.Tag({
         fill: 'yellow',
         
     }));

     simpleLabel.add(new Konva.Text({
         text: 'Simple label',
         fontFamily: 'Calibri',
         fontSize: 18,
         id:id,
         padding: 5,
         fill: 'black'
     }));

     element = (simpleLabel);
    }
    return element;
}