function getEXIFData(imageid,targetid){
    var img2 = document.getElementById(imageid);
    EXIF.getData(img2, function() {
        var allMetaData = EXIF.getAllTags(this);
        console.log(allMetaData)
        var allMetaDataSpan = document.getElementById(targetid);
        allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
        var htmltip="<ul>"
        for(tag in allMetaData){
          htmltip+="<li>"+tag+" - "+allMetaData[tag]+"</li>"
        }
        htmltip+="</ul>"
        $( "#metadata" ).tooltip({ content: htmltip });
    });
}

  var curnamespace="http://purl.org/cuneiform/"

	var mappings={"PaleoCode":{"inputtype":"text","regex":"","handler":null,"paleocodage":true,"uri":curnamespace+"PaleoCode"},
	"Transliteration":{"inputtype":"text","regex":"","handler":null,"uri":curnamespace+"Transliteration"},
  "UnicodeCharName":{"inputtype":"select","regex":"","handler":null,"data":charlistmap,"uri":curnamespace+"CharacterName"},
  "Column":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Column"},
	"Line":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Line"},
  "Charindex":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Charindex"},
  "Wordindex":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Wordindex"}
	}

  var readOnlyVar=true
if(isNotReadOnly){
  readOnlyVar=false
}
	  
	var TextMapWidget = function(args) {

  var addTag = function(evt) {
    console.log("onKeyUp")
	console.log(evt.srcElement.value)
	console.log(args)
	var removeindex=-1
	for(bod in args.annotation.underlying.body){
		if(args.annotation.underlying.body[bod].purpose==evt.target.id){
			removeindex=bod
		}
	}
  if(removeindex==-1){
	  args.annotation.underlying.body.push({
        type: 'TextualBody',
        purpose: evt.target.id,
        //dimensions: viewer.world.getItemAt(0).getContentSize(), 
        value: evt.srcElement.value
    });
  }else{
    args.annotation.underlying.body[removeindex].value=evt.srcElement.value
    args.annotation.underlying.body[removeindex].dimensions=viewer.world.getItemAt(0).getContentSize()
  }
	console.log(args)
	console.log({
        type: 'TextualBody',
        purpose: evt.target.id,
        //dimensions: viewer.world.getItemAt(0).getContentSize(), 
        value: evt.srcElement.value
    })
  }

  // 4. This part renders the UI elements
  var createTextField = function(key,value) {
    console.log(key+" - "+value)
    var div=document.createElement('table')
    div.style="color:black;background-color:white"
	div.width="100%"
	var tr=document.createElement('tr')
  tr.style="color:black;background-color:white;border-bottom:1px solid black;"
	var td1=document.createElement('td')
  td1.style="color:black;background-color:white"
	var td2=document.createElement('td')
  td2.style="color:black;background-color:white;text-align:right"
	div.appendChild(tr)
	tr.appendChild(td1)
	tr.appendChild(td2)
  var label = document.createElement('label');
  label.style="color:black;background-color:white"
  if(!readOnlyVar){
	  var input = document.createElement('input');
  }else{
    var input = document.createElement('span');
    input.style="color:black;background-color:white;text-align:right"
  }

	console.log(mappings[key])
  if(!readOnlyVar && "inputtype" in mappings[key] && mappings[key]["inputtype"]=="select"){
    input = document.createElement('select');
  }else if(!readOnlyVar && "inputtype" in mappings[key]){
		input.type=mappings[key]["inputtype"]
		input.min=1
	}else if(!readOnlyVar){
		input.type="text"	
	}
  if(!readOnlyVar && "data" in mappings[key] && mappings[key]["inputtype"]=="select"){
    for(keyy in mappings[key]["data"]){
      console.log(keyy)
      option=document.createElement("option")
      option.value=keyy
      option.text=mappings[key]["data"][keyy]["signName"]
      input.appendChild(option)
    }
    for(bod in args.annotation.underlying.body){
		  /*if(args.annotation.underlying.body[bod].purpose==key){
			  input.value=args.annotation.underlying.body[bod].value
		  }*/
	  }
  }else{
    for(bod in args.annotation.underlying.body){
		  if(args.annotation.underlying.body[bod].purpose==key){
        if(!readOnlyVar){
          input.value=args.annotation.underlying.body[bod].value
        }else{
          input.innerHTML=args.annotation.underlying.body[bod].value
        }		  
      }
	  }
    if(!readOnlyVar){
	    input.addEventListener('keyup',addTag)
    }
  }
	input.id=key
	label.innerHTML=key+": "
	td1.appendChild(label)
	td2.appendChild(input)
  if(!readOnlyVar && "paleocodage" in mappings[key]){
    var td3=document.createElement('td')
    tr.appendChild(td3)
    var canvas=document.createElement('canvas')
    td3.appendChild(canvas)
    canvas.id="myCanvas"
    canvas.width=150
    canvas.height=75
    canvas.style="border:1px solid #d3d3d3;"
    input.addEventListener('keyup',function(event){
        paintCharacter(event.target.id)        
        //selectionStart=$('#PaleoCode').prop('selectionStart')
        //selectionEnd=$('#PaleoCode').prop('selectionEnd')
        //strokeParser(document.getElementById('PaleoCode').value)
    });
    input.addEventListener('blur',function(event){
        paintCharacter(event.target.id)        
        //selectionStart=$('#PaleoCode').prop('selectionStart')
        //selectionEnd=$('#PaleoCode').prop('selectionEnd')
        //strokeParser(document.getElementById('PaleoCode').value)
    });
    input.addEventListener("click",function(){
        paintCharacter(event.target.id)
    });
    input.addEventListener("select",function(){
        paintCharacter(event.target.id)
    });
  }
    return div;
  }

  var container = document.createElement('div');
  container.className = 'colorselector-widget';
  for(map in mappings){
    var curval="";
    for(body of args.annotation.bodies){
		if(body.purpose==map){
			curval=body.value
			break;
		}
	}
	var button1 = createTextField(map,curval);	
	container.appendChild(button1);
  }

  return container;
}



function loadImageWithAnnotations(image,annotation){
    document.getElementById("showingimage").src=image;
    anno.loadAnnotations(annotation);
    $('#filename').html(image)
}

var curnamespace="http://purl.org/cuneiform/"


var mlVocabulary=[{"label":"Broken","uri":curnamespace+"Broken"},{"label":"Character","uri":curnamespace+"Character"},{"label":"Line","uri":curnamespace+"Line"},{"label":"Image","uri":curnamespace+"Image"},{"label":"Word","uri":curnamespace+"Word"},{"label":"Seal","uri":curnamespace+"Seal"},{"label":"Phrase","uri":curnamespace+"Phrase"},{"label":"Erased","uri":curnamespace+"Erased"},{"label":"StrikeOut","uri":curnamespace+"StrikeOut"},{"label":"Wordstart","uri":curnamespace+"Wordstart"},{"label":"Wordend","uri":curnamespace+"Wordend"},{"label":"InWord","uri":curnamespace+"InWord"},{"label":"UnknownIfWord","uri":curnamespace+"UnknownIfWord"}]


    var semantictagsconfig={
        dataSources: [  
            'Wikidata', 
            'VIAF'
        ],
        availableLanguages: [
            'en', 'de', 'fa'
        ],
        limit: 10
    }

    var annoconfig={widgets:[
    TextMapWidget,
    recogito.SemanticTags(semantictagsconfig),
    'COMMENT',
    { widget: 'TAG', 
    vocabulary: mlVocabulary
    }
    ]}

    // Initialize the Annotorious plugin
    var anno = OpenSeadragon.Annotorious(viewer,annoconfig);
    getCurrentUser().then(function(user){
        anno.setAuthInfo({
        id: user["id"],
        displayName: user["username"]
        });
    });

    if(!readOnlyVar){
      Annotorious.Toolbar(anno, document.getElementById('my-toolbar-container'));
      Annotorious.SelectorPack(anno);
    }
    anno.on('createAnnotation', function(a) {
      console.log(a)
      console.log(JSON.stringify(a))
      console.log(a["id"])
      curanno[a["id"]]=a
      $(".a9s-annotation").on("dragover", function(event) {
          event.preventDefault();
          event.stopPropagation();
          return false;
      });
      $(".a9s-annotation").on("drop", function(event) {
          event.preventDefault();
          event.stopPropagation();
          console.log(event)
          console.log(event.originalEvent.dataTransfer)
          var data = event.originalEvent.dataTransfer.getData("text");
          var data2 = event.originalEvent.dataTransfer.getData("text2");
          console.log(data)
          console.log(data2)
		      event.currentTarget.annotation.underlying.body.push({"purpose":"linking","type":"TextualBody","value":data})
		      event.currentTarget.annotation.underlying.body.push({"purpose":"tagging","type":"TextualBody","value":data})
		      event.currentTarget.annotation.underlying.body.push({"purpose":"tagging","type":"TextualBody","value":data2})
      }); 
      $(".a9s-annotation").attr("draggable", "True");
		  $('.a9s-annotation').on('dragstart', function (event) {
         console.log("DRAGSTART")
         console.log(event.target)
		 console.log($(event.target).data("id"))
         event.originalEvent.dataTransfer.setData("text", $(event.target).data("id"));
      }); 
    if(typeof currentuser !== 'undefined'){
      curanno[a["id"]]["user"]=currentuser
     }

     //ondrop="dropThis(event)" ondragover="allowDropThis(event)"
    });
    anno.on('deleteAnnotation', function(a) {
      delete curanno[a["id"]]
    });
    anno.on('updateAnnotation', function(a) {
      curanno[a["id"]]=a
    if(typeof currentuser !== 'undefined'){
        curanno[a["id"]]["user"]=currentuser
      }
    });
    anno.on('selectAnnotation', function(a) {
      console.log(curanno[a["id"]])
      selectedannotation=curanno[a["id"]]
    });



