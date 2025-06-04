const modal = document.getElementById("modal");
const close_button = document.getElementsByClassName("close")[0];
const playlists = document.querySelectorAll(".playlist");

function openModal(playlist) {
    modal.style.display = "block"
}

close_button.addEventListener("click", () => {
    modal.style.display = "none"
})

for(i = 0; i < playlists.length; i++){
    playlists[i].addEventListener("click", () => {
        openModal()
    })
}

window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}

function loadPlaylistData(){
    const playlistGrid = document.getElementById("playlist-cards")
    playlistData.forEach(playlist => {
        const element = createPlaylistElement(playlist);
        playlistGrid.appendChild(element);
    })


}

function createPlaylistElement(playlist){
    const div = document.createElement('article');
    div.className = 'playlist';
    div.innerHTML = `
    `;
    return div;
}

loadPlaylistData();