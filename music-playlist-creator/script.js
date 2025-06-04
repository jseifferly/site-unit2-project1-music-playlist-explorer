const modal = document.getElementById("modal");
const close_button = document.getElementsByClassName("close")[0];
let playlist = document.querySelector(".playlist");

function openModal(playlist) {
    modal.style.display = "block"
}

close_button.addEventListener("click", () => {
    modal.style.display = "none"
})

playlist.addEventListener("click", () => {
    openModal()
})
