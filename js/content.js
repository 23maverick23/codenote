var div = document.createElement("div");
div.id = "codeNoteMain";
div.style.display = "none";
// floatDiv.style.position = "fixed";
// floatDiv.style.bottom = "0";
// floatDiv.style.right = "0";
// floatDiv.style.height = "40px";
// floatDiv.style.width = "100px";
// floatDiv.style.backgroundColor = "#81a2be";

// var floatHeader = document.createElement("h3");
// floatHeader.style.color = "#ffffff";
// floatHeader.style.textAlign = "center";
// floatHeader.style.verticalAlign = "middle";
// floatHeader.style.margin = "0 auto";
// floatHeader.style.padding = "10px";

// var floatTxt = document.createTextNode("Text");

document.body.appendChild(div);

var content = '';

content += '<div id="codeNoteHandle"><h3>CodeNote</h3></div>';

$("#codeNoteMain").html(content);