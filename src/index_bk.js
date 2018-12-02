var getProperties  = function(id){
    if(id === "labelField"){
        return {
            fontFamily: ['Calibri',"Arial"],
            background:["white", "Red","Green"],
            fontSize: [10,11,12,13,14,15],
            Text: 'Simple Text',
            draggable:true,
            Color: ["black", "Red","Green"]
        }

    }
    if(id === "textField"){
        return {
            Width: 100,
            Height: 20,
            draggable :true,
            Color: ["white", "Red","Green"],
            borderColor: ["black", "Red","Green"],
            borderWidth: 2
        }
        
    }
    if(id === "labelField"){
        
    }
} 
 var init = function(){
     var savedData = null;

    function drawBackgroundGrid(gridLayer){
        var width = window.innerWidth;
        var height = window.innerHeight;
        var padding = 15;
        console.log(width, padding, width / padding);
        for (var i = 0; i < width / padding; i++) {
          gridLayer.add(new Konva.Line({
            
            points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
            stroke: '#ccc',
            strokeWidth: 1,
          }));
        }
        
        gridLayer.add(new Konva.Line({points: [0,0,10,10]}));
        for (var j = 0; j < height / padding; j++) {
          gridLayer.add(new Konva.Line({
            points: [0, Math.round(j * padding), width, Math.round(j * padding)],
            stroke: '#ccc',
            strokeWidth: 0.5,
          }));
        }
    }

   function drawElement(e, layer){
      
       if(e.evt.fromElement){
           var x = e.evt.layerX;
           var y= e.evt.layerY;
           var id = 'konva-'+parseInt(Math.random()*1000)+e.evt.fromElement.id
           if(e.evt.fromElement.id==="labelField"){
            layer.add(new Konva.Text({
                x: x,
                y: y,
                id:id,
                fontFamily: 'Calibri',
                background:"white",
                fontSize: 13,
                text: 'Simple Text',
                draggable:true,
                fill: 'black'
            }));
           
           }
           if(e.evt.fromElement.id==="textField"){
            layer.add(new Konva.Rect({
                x: x,
                y: y,
                id:id,
                width: 100,
                height: 20,
                draggable :true,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2
            }));
           }
           if(e.evt.fromElement.id==="lineField"){
            
            layer.add(new Konva.Line({
                points: [x, x, 0, 0, 20],
                stroke: 'red',
                draggable:true,
                strokeWidth: 15,
                lineCap: 'round',
                lineJoin: 'round'
              }));
           }
           layer.draw();
           
       }

   }



     stage = new Konva.Stage({
        container: 'drawcanvas',
        width:1000,
        height:1000
    })

    var backgroundLayer = new Konva.Layer();
    
    /*var shadowRectangle = new Konva.Rect({
        x: 0,
        y: 0,
        width: blockSnapSize * 6,
        height: blockSnapSize * 3,
        fill: '#FF7B17',
        opacity: 0.6,
        stroke: '#CF6412',
        strokeWidth: 3,
        dash: [20, 2]
      });*/
    drawBackgroundGrid(backgroundLayer);

   
    stage.add(backgroundLayer);

     layer = new Konva.Layer();
    
    stage.add(layer);
    layer.draw();

    stage.on("contentMouseover",function(e){
        drawElement(e, layer);
    });

    stage.on('click', function (e) {
        // if click on empty area - remove all transformers
        if (e.target === stage) {
          stage.find('Transformer').destroy();
          layer.draw();
          return;
        }
        console.log(e.target);
        // do nothing if clicked NOT on our rectangles
       /* if (!e.target.hasName('rect')) {
          return;
        }*/
        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        stage.find('Transformer').destroy();
  
        // create new transformer
        var tr = new Konva.Transformer();
        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
      })


      $("#btnSave").on("click",function(){
          console.log(stage.children[1].toJSON());
         savedData = stage.children[1].toJSON();
     
      });
      $("#btnLoad").on("click",function(){
        $("#drawcanvas").html("");
        var json = savedData;
        var stage = Konva.Node.create(json, 'drawcanvas');
   
    });


      $("#btnClear").on("click",function(){
          
          console.log(stage.children[1].toJSON());
        layer.destroyChildren();
    });
    $("#btnDownload").on("click",function(){
       /* var obj = stage.children[1].toJSON();
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        var ele = $('<a href="data:' + data + '" download="data.json" id="hiddenAnchor"></a>');
        
        $(ele).appendTo(document.body);
        $(ele).click();*/
        var imgData = stage.children[1].toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF();
      
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
        
    });

};

$(document).ready(init);