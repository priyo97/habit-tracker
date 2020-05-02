var modal=document.getElementById("modal");
var updateHabitButton = document.getElementById("update-habit-button");

var closeModalButton = document.getElementById("habit-button");
var openModalButton = document.getElementById("add-modal");


//Listening for click
openModalButton.addEventListener("click",openModal);
closeModalButton.addEventListener("click",closeModal);
updateHabitButton.addEventListener("click",changeBackground);

//modal functions
function openModal()
{
    modal.style.display='block';
}

function closeModal()
{
    modal.style.display='none';
}

function changeBackground()
{
    // document.body.style.backgroundColor="#9d9d9d";
}