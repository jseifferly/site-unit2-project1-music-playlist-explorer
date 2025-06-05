const modal = document.getElementById("modal");
const close_button = document.getElementsByClassName("close")[0];


    //**DYNAMICALLY LOAD PLAYLIST DATA**//

function loadPlaylistData(){
    const playlistGrid = document.getElementById("playlist-cards")

    if(playlistData.length === 0){
        const element = noPlaylistsMessage();
        playlistGrid.appendChild(element);
    }

    playlistData.forEach(playlist => {
        const element = createPlaylistElement(playlist);
        playlistGrid.appendChild(element);
    })
}

function createPlaylistElement(playlist){
    const div = document.createElement('article');
    div.className = 'playlist';
    div.innerHTML = `
        <img class="playlist-cover" src=${playlist.playlist_art} alt="">
        <h3 class="playlist-title">${playlist.playlist_name}</h3>
        <h4 class="playlist-creator-name">${playlist.playlist_author}</h4>
        <p class="like-count">&#129505;${playlist.like_count}</p>  
    `;
    return div;
}

function noPlaylistsMessage() {
    const div = document.createElement('div');
    div.className = 'no-playlists';
    div.innerHTML = `No playlists added...`
    return div
}

loadPlaylistData();
const playlists = document.querySelectorAll(".playlist");
let playlistDisplay = null;


    //**MODAL FUNCTIONALLITY AND DYNAMICALLY POPULATE MODAL**//

function openModal(playlist) {
    modal.style.display = "block"
}

close_button.addEventListener("click", () => {
    modal.style.display = "none"
})

for(i = 0; i < playlists.length; i++){
    playlists[i].addEventListener("click", () => {
        playlistDisplay = playlists[i]
        console.log(playlistDisplay)
        openModal()
    })
}

window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}