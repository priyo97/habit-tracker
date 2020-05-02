var modal=document.getElementById("modal");

var closeModalButton = document.getElementById("habit-button");
var openModalButton = document.getElementById("add-modal");


//Listening for click
openModalButton.addEventListener("click",openModal);
closeModalButton.addEventListener("click",closeModal);

//modal functions
function openModal()
{
    modal.style.display='block';
}

function closeModal()
{
    modal.style.display='none';
}