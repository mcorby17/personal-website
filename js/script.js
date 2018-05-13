window.addEventListener("load", function(){
  //Grab elements that trigger modals
  const triggers = document.getElementById("modalWrapper").getElementsByClassName("popout");

  //Grab contact trigger/modal individually since not in same div as popout elements
  const contact = document.getElementById("contactMe");
  const cmodal = document.getElementById("contactModal");

  //Grab closing 'x's
  const span = document.getElementsByClassName("close");

  //Assign click event handler to each trigger and 'x'
  for(let i = 0; i<triggers.length; i++){
    let currModal = document.getElementById("modal" + i);
    triggers[i].onclick = () => currModal.style.display = "block";
    //First item in span is the contact 'x'. Skip it
    span[i+1].onclick = () => currModal.style.display = "none";
  }

  //individually assign click event handlers to contact elements
  contact.onclick = () => cmodal.style.display = "block";
  span[0].onclick = () => cmodal.style.display = "none";

  //Allow the modal to close if click is made outside modal
  window.onclick = function(event){
    if(event.target == modal0){
      modal0.style.display = "none";
    }
    else if (event.target == modal1) {
      modal1.style.display = "none";
    }
    else if (event.target == modal2) {
      modal2.style.display = "none";
    }
    else if (event.target == cmodal){
      cmodal.style.display = "none";
    }
  }
});
