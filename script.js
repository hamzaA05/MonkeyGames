// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function myFunction() {
  var input, filter, ul, li, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");

  // Array zur Aufbewahrung der passenden Elemente
  var matchedElements = [];

  // Durch die Liste laufen und die passenden Elemente in matchedElements speichern
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].textContent || li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      matchedElements.push(li[i]);
    }
  }

  // Wenn der Filterwert leer ist, die ursprüngliche Reihenfolge wiederherstellen
  if (filter === '') {
    for (i = matchedElements.length - 1; i >= 0; i--) {
      ul.insertBefore(matchedElements[i], ul.firstChild);
    }
  } else {
    // Alle passenden Elemente in der Liste nach oben bewegen
    for (i = 0; i < matchedElements.length; i++) {
      ul.insertBefore(matchedElements[i], ul.firstChild);
    }
  }
}
