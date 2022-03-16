// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// Get the button that close the modal
var cbtn = document.getElementById("closebtn");

// When the user clicks on close btn in the model, close the modal
cbtn.onclick = function() {
    modal.style.display = "none";
}

// Edit Button

$('#projectdata').SetEditable();