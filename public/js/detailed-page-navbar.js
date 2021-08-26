var btns = document.getElementsByClassName("navbar-option");
var overview = document.getElementById("overview-div");
var about = document.getElementById("about-div");
var preparation = document.getElementById("preparation-div");

for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active-option");
  var id = this.id;
  //console.log(id);
  current[0].className = current[0].className.replace(" active-option", "");
  this.className += " active-option";
  let element = id + "-div";
  if(element === "overview-div") {
    overview.style.display="block";
    about.style.display="none";
    preparation.style.display="none";
  } else if(element === "about-div") {
    overview.style.display="none";
    about.style.display="block";
    preparation.style.display="none";
  } else {
    overview.style.display="none";
    about.style.display="none";
    preparation.style.display="block";
  }
});
}

window.onresize = function(){
  if(screen.width >= 480) {
    about.style.display="block"; 
    preparation.style.display="block"; 
  } else {
    about.style.display="none"; 
    preparation.style.display="none"; 
  }
}