// JavaScript Document
// credit: http://www.yourhtmlsource.com/images/rollovers.html
// image rollovers
var revert = new Array();
var inames = new Array('btn_home', 'btn_about', 'btn_contact', 'btn_blog', 'btn_projects', 'wsch', 'arr_next', 'arr_prev');

// Preload
if (document.images) {
  var flipped = new Array();
  for(i=0; i< inames.length; i++) {
    flipped[i] = new Image();
    flipped[i].src = "images/"+inames[i]+"_on.gif";
  }
}

function over(num) {
  if(document.images) {
    revert[num] = document.images[inames[num]].src;
    document.images[inames[num]].src = flipped[num].src;
  }
}
function out(num) {
  if(document.images) document.images[inames[num]].src = revert[num];
}
