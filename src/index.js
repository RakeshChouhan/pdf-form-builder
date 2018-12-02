

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
}

function loadSavedTemplate(){
    var existingkeys = ['length','getItem','setItem','key', 'removeItem','clear'];
    var opts = [];
    opts.push("<option value='--Select template--'>--Select template--</option>");
    for(template in window.localStorage){
        if((existingkeys.indexOf(template)===-1)){
            opts.push('<option value="'+ template +'">'+ template +'</option>');
        }
    }
    $('#selecttemplate').html(opts.join(' '));
}

 function drawElement(e, layer){
      
       if(e.evt.fromElement){
           var x = e.evt.layerX;
           var y= e.evt.layerY;
           var frmEleID = e.evt.fromElement.id;
           var isVariable = $(e.evt.fromElement).hasClass("variable");

           var id = 'konva-'+parseInt(Math.random()*1000)+frmEleID;
           var element = getElement(x,y,id,frmEleID,isVariable,e);
           if(element) {
            layer.add(element);
            layer.draw();
           }
          
           
       }

   }
function registerEventOnStage (stage){
    stage.on("contentMouseover",function(e){
        var layer = stage.findOne("#elementLayer");
        drawElement(e, layer);
    });

    var container = stage.container();
    
        // make it focusable
    
        container.tabIndex = 1;
        // focus it
        // also stage will be in focus on its click
        container.focus();
    
    
    container.addEventListener('keydown',function(e){
        console.log(e);
        if(e.keyCode === 46 || e.keyCode === 8){
            var parent =  stage.find('Transformer')[0].getNode().parent;
            
            stage.find('Transformer')[0].getNode().destroy();
            stage.find('Transformer').destroy();
            parent.draw();
        }
        
    });
    stage.on('click',function(e){
        // if click on empty area - remove all transformers
        var layer = stage.findOne("#elementLayer");
        if (e.target === stage) {
          stage.find('Transformer').destroy();
          
          layer.draw();
          $('#propContainer').html('');
          $('#propContainer').html('No Object selected');
          
          return;
        }
        enablePropertiesPanel(e.target);
        stage.find('Transformer').destroy();
  
        // create new transformer
        var tr = new Konva.Transformer();
        layer.add(tr);
        if(e.target.parent && e.target.parent.nodeType === "Group" && e.target.parent.id().indexOf("multitextfield") != -1){
            tr.attachTo(e.target.parent.parent);
        }else if(e.target.parent && e.target.parent.nodeType === "Group"){
            tr.attachTo(e.target.parent);
        }else{
            tr.attachTo(e.target);
        }
        
        layer.draw();
    });

}
function isMultiTextBox(element){
    return element.id().indexOf("multitextfield") > -1;
}
function changeMultiLengthBox(id,e){
    var value = isNaN($(e).val()) ? $(e).val() : parseInt($(e).val());
    var element = stage.findOne("#"+id);
    if(isMultiTextBox(element)){
        var textField = element.children.filter(function(el){ return el.nodeType==="Group" })
        var changeNumberOfFields = value - textField.length;
        if(changeNumberOfFields > 0){
            while(changeNumberOfFields > 0 ){
                
                var len = textField.length;
                addFieldsInMultiTextBox(element, len++);
                textField = element.children.filter(function(el){ return el.nodeType==="Group" })
                changeNumberOfFields = value - textField.length;
                
            }
            
        }else{
            var collection = new Konva.Collection();
            
            for(var i=0; i<element.children.length; i++){
                var el = element.children[i];
                if(i<value && el.nodeType==="Group"){
                    collection.push(el);

                }else if(el.nodeType !== "Group"){
                    collection.push(el);
                }
            }
            element.children = collection;

        }
        stage.findOne("#elementLayer").draw();
    }
}
function detectChange (id, prop ,e){
    console.log(id);
    var value = isNaN($(e).val()) ? $(e).val() : parseInt($(e).val());
    var element = stage.findOne("#"+id);
    var updatedProp = {};
    updatedProp[prop] = value ;
    element.setAttrs(updatedProp);
    element.parent.draw();
    
}
function bindVariable(e, id){
   var variable =  $(e).val();
   var element = stage.findOne("#"+id);
   console.log(element);
   if(element.nodeType ==="Shape"){
       element.setAttrs({
           text:variable
       })
   }else if(isMultiTextBox(element)){
       var textField = element.children.filter(function(el){ return el.nodeType==="Shape" && el.className==="Text"})
       if(textField.length > 0){
           textField[0].setAttrs({
            text:variable
        })
       }
   }
   stage.findOne("#elementLayer").draw();


}

 var init = function(){
     
    function drawBackgroundGrid(gridLayer){
        var width = window.innerWidth;
        var height = $("#drawcanvas").height()
        var padding = 10;
        for (var i = 0; i < width / padding; i++) {
          gridLayer.add(new Konva.Line({
            
            points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
            stroke: '#ccc',
            strokeWidth: 1,
          }));
        }
        console.log(width);
        
        console.log(height);
        
        console.log(padding);
        gridLayer.add(new Konva.Line({points: [0,0,10,10]}));
        for (var j = 0; j < height / padding; j++) {
          gridLayer.add(new Konva.Line({
            points: [0, Math.round(j * padding), width, Math.round(j * padding)],
            stroke: '#ccc',
            strokeWidth: 0.5,
          }));
        }
    }

  
    


     stage = new Konva.Stage({
        container: 'drawcanvas',
        width:780,
        height:1100
    })

    var backgroundLayer = new Konva.Layer();
    backgroundLayer.id("backgroundLayer");
    
  
    drawBackgroundGrid(backgroundLayer);

   
    stage.add(backgroundLayer);

     layer = new Konva.Layer();
     layer.id("elementLayer");
    stage.add(layer);
    layer.draw();
   registerEventOnStage(stage);
      

      loadSavedTemplate();


      $("#btnSave").on("click",function(){
          stage.find('Transformer').destroy();
          
          if(window.localStorage){
              var templateName = prompt("Enter tempalte Name ");
              localStorage.setItem(templateName,stage.toJSON());
          }
          console.log(stage.toJSON());
     
      });
      $("#btnLoad").on("click",function(){
        $("#drawcanvas").html("");
        
        if(window.localStorage){
            var selectedTemplate= $("#selecttemplate").val();
            if(selectedTemplate === '--Select template--'){
                alert("Invalid Template");
            }
            var json = localStorage.getItem(selectedTemplate)
            stage = Konva.Node.create(json, 'drawcanvas');
           // stage.on('click',function(e){
                registerEventOnStage(stage);
            //});
            
        }
   
    });


      $("#btnClear").on("click",function(){
        stage.find('Transformer').destroy();
        console.log(stage.children[1].toJSON());
        layer.destroyChildren();
    });
    $("#btnDownload").on("click",function(){
        stage.find('Transformer').destroy();
        var imgData = stage.children[1].toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF();
      
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
        
    });
    $("#hideGrid").on('click',function(e){
        if(e.target.checked){
            stage.children[0].show();
            $("#toggleGrid").html("Hide Grid");
        }else{
            stage.children[0].hide();
            $("#toggleGrid").html("Show Grid");
        }
        
    });

   
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stage.toJSON()));
        $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#btnDownloadJson');
    
};

$(document).ready(init);