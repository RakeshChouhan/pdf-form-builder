var DISPLAY_PROP = {
    stroke:"Border color",
    strokeWidth : "Border width",
    fontStyle:"Font style",
    fontFamily: "Font family",
    fontSize:  "Font size",
    fill:   "Color",
    height:"Height",
    x:"X",
    y:"Y",
    text:"Text",
    width:"Width",
    lineField_stroke:"Border color",
    lineField_strokeWidth : "Border width"

};
var getProperties  = function(id){
    if(id.indexOf("labelField") >-1){
        return {
            fontFamily: ['Calibri',"Arial", 'Arial bold','Gotham', 'Tahoma'],
            fontSize: 10,
            text: 'Simple Text',
            x: 10,
            y:10,
            fontStyle: ["bold", "italic", "normal", "bold italic"],
            fill: ["black", "Red","Green","white", "blue","purple"]
        }

    }
    if(id.indexOf("rect")>-1){
        return {
            width: 100,
            height: 20,
            x: 10,
            y:10,
            fill:  ["black", "Red","Green","white", "blue","purple"],
            stroke:  ["black", "Red","Green","white", "blue","purple"],
            strokeWidth: 2
           // background : ["white", "Red","Green"]
        }
        
    }
    if(id.indexOf("lineField")>-1){
        return {
            stroke:  ["black", "Red","Green","white", "blue","purple"],
            strokeWidth: 1
            
        }
        
    }
    if(id.indexOf("multitextfield")>0){
        return {
            MultiboxLength:12,
        }

    }
} 
                                               

var createVariableList = function(id){
   return `<select onchange="bindVariable(this,'${id}')"> 
        <option value="None" selected> Select Variable</option>
        <option value="<<Site ID>>">Site ID</option>
        <option value="<<Sponsor>>">Sponsor</option>
        <option value="<<Study ID>>">Study ID</option>
        <option value="<<Visit Number>>">Visit Number</option>
        <option value="<<Patient Accession>>">Patient Accession</option>
        <option value="<<Requisition Number>>">Requisition Number</option>
        <option value="<<Address>>">Address</option>
        <option value="<<Date>>">Date</option>
    
    
    </select>
    `
}

function getElementId(element){
    if(element.parent.nodeType==='Group'){
        if(element.parent.parent.nodeType==='Group'){
            return element.parent.parent.id();
        }else{
            return element.parent.id();
        }
    }else{
        return element.id();
    }
}

var enablePropertiesPanel = function(element){
    //  console.log(element)
      var attributes = element.attrs;
      var eleID = getElementId(element);
      if(eleID){
        var table = `<table class="table table-bordered">
        <thead>
          <tr>
            <th>Property</th>
            <th scope="col">Value</th>
          </tr>
        </thead><tbody>`;
      //  table += '<tr><td>Variable</td><td>'+createVariableList(eleID)+'</td></tr>';
  
        if(eleID.indexOf("multitextfield") > -1){
          
          var groupField = element.parent.parent.children.filter(function(el){ return el.nodeType==="Group"})
          var len = groupField.length;
          if(len > 0){
              table += `<tr><td>MultiboxLength</td><td><input type="number"  onchange=changeMultiLengthBox('${eleID}',this) value='${len}'</td></tr>`;
              
          }
        }
        var defaultProps = getProperties(eleID);
        for(prop in defaultProps){
           
            table+='<tr>';
            if(typeof defaultProps[prop] ==="string"){
               table+= `<td>${DISPLAY_PROP[prop]}</td>
                <td scope="col"><input type="text" onchange=detectChange('${attributes.id}','${prop}',this) value='${attributes[prop]}'/></td>`
            }else if($.isArray(defaultProps[prop])){
              table+= `<td>${DISPLAY_PROP[prop]}</td>
              <td scope="col">  <select onchange=detectChange('${attributes.id}','${prop}',this) >`;
               var selAttr = "";
                for(var i=0; i<defaultProps[prop].length; i++){
                    
                  table += `<option value='${defaultProps[prop][i]}' ${(defaultProps[prop][i] === attributes[prop]) ? "selected" : ""} > ${defaultProps[prop][i]}</option>`
                }
                
              table += '</select> </td>';
              }else if(typeof attributes[prop] ==="number"){
                table+= `<td>${DISPLAY_PROP[prop]}</td>
                 <td scope="col"><input type="number" onchange=detectChange('${attributes.id}','${prop}',this) value='${attributes[prop]}'/></td>`
             }
             table+='</tr>';
        }
        table += `</tbody></table>`
        $('#propContainer').html('');
        $('#propContainer').html(table);
      }
     
      
  
  }