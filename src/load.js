var DATA ={ 
    "<<Site ID>>":"0110",
    "<<Sponsor>>":"Acerta Pharma BV",
    "<<Study ID>>":"ACE-CL-006",
    "<<Visit Number>>":"1",
    "<<Patient Accession>>":"OS12ASD12",
    "<<Requisition Number>>":"0110",
    "<<Address>>":"Kentucky Pediatric - Adult Research\n 201 S Fifth St. Bardstown,\n KY 40004 UNITED STATES"
}

function loadSavedTemplate(){
    // console.log($('selecttemplate'));
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

var init = function(){
    var stage;


    function process(jsonString){
        var json = JSON.parse(jsonString);
        json.children = json.children.filter(function(child){ 
            return child.attrs.id==="elementLayer"
        });
        if(json.children && json.children.length > 0){
            var layer = json.children[0].children;
            var object;
            for(var i=0; i<layer.length; i++ ){
                object = layer[i];
                
                 if(object.attrs.id.indexOf("labelField") > -1 ){
                    if(object.attrs.text && object.attrs.text.indexOf("<<") > -1){
                        object.attrs.text = DATA[object.attrs.text] ? DATA[object.attrs.text] : object.attrs.text
                    }
                     
                 }else if(object.attrs.id.indexOf("multitextfield") > -1 ){
                     var textObj = object.children.filter(function(child){
                                    return child.className=="Text"
                        });
                    var txt;
                    if(textObj.length > 0 ){
                      txt =  textObj[0].attrs.text;
                    }
                        
                    if(txt && txt.indexOf("<<") > -1){
                       txt = DATA[txt] ? DATA[txt] : txt;
                        var subTextObj;
                        for(var j=0;j<object.children.length ; j++){
                            subTextObj = object.children[j];
                            if(subTextObj.className.indexOf("Text") > -1){
                                subTextObj.attrs.text = "";
                            }
                            if(subTextObj.className.indexOf("Label") > -1){
                                var subTextField;
                                for(var k=0; k<subTextObj.children.length ; k++){
                                    subTextField = subTextObj.children[k];
                                    if(j<=txt.length && (subTextField.className.indexOf("Text") > -1) ){
                                        subTextField.attrs.text = txt[j];
                                    }
                                }
                            }
                        }
                    }
                 }
            }
        }
        

        return JSON.stringify(json);

    }
    
    $("#btnLoad").on("click",function(){

        if(window.localStorage){
            $("#drawcanvas").html("");
            var selectedTemplate= $("#selecttemplate").val();
            if(selectedTemplate === '--Select template--'){
                alert("Invalid Template");
            }
            var json = localStorage.getItem(selectedTemplate)
            json = process(json);
            stage = Konva.Node.create(json, 'container');
            stage.setListening(false);
        }
    });  

    $("#btnDownload").on("click",function(){
         var imgData = stage.children[0].toDataURL("image/jpeg", 1.0);
         var pdf = new jsPDF();
       
         pdf.addImage(imgData, 'JPEG', 0, 0);
         pdf.save("download.pdf");
         
     });


     loadSavedTemplate();

}


$(document).ready(init);