const modal = document.getElementById("modal");


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
const playlists = Array.from(document.querySelectorAll(".playlist"));
console.log(playlists)


    //**MODAL FUNCTIONALLITY AND DYNAMICALLY POPULATE MODAL**//

function openModal(playlist) {
    populateModal(playlist);
    modal.style.display = "block";
}

for(i = 0; i < playlists.length; i++){
    playlists[i].addEventListener("click", (event) => {

        let clickedIndex = -1;

        if(event.target.className == 'playlist'){
            clickedIndex = playlists.indexOf(event.target)
        }else{
            clickedIndex = playlists.indexOf(event.target.parentNode)
        }

        openModal(playlistData[clickedIndex])
    })
}

window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}

function populateModal(playlist){
    const modal_content = document.getElementById('modal-content');
    modal_content.innerHTML = ``

    const span = document.createElement('span');
    span.className = 'close';
    span.innerHTML = '&times;';
    span.addEventListener("click", () => {
        modal.style.display = "none"
    })
    modal_content.appendChild(span);

    const header = createModalHeaderElement(playlist);
    modal_content.appendChild(header);

    const song_list = createModalSongList(playlist.songs);
    modal_content.appendChild(song_list);

}


function createModalHeaderElement(playlist){
    const div = document.createElement('div');
    div.className = 'modal-header';
    div.innerHTML = `<img id="modal-playlist-cover" src="${playlist.playlist_art}" alt="">
                    <div class="playlist-info">
                    <h2 id="modal-title">${playlist.playlist_name}</h2>
                    <h3 id="modal-creator">${playlist.playlist_author}</h3>
                    </div>
    `
    return div;
}

function createModalSongList(songs){
    const div = document.createElement('div');
    div.className = 'song-list';
    for (i = 0; i < songs.length; i++) {
        const songElement = createModalSongTile(songs[i]);
        div.appendChild(songElement);
    }

    return div;
}

function createModalSongTile(song){
    const div = document.createElement('article');
    div.className = 'song-tile';
    div.innerHTML = `
        <img class="song-cover" src="${song.song_art}" alt="">
        <div class="song-info">
            <h5 class="song-title">${song.song_title}</h5>
            <h6 class="artist-name">${song.song_author}</h6>
            <h6 class="albumn-name">${song.albumn_name}</h6>
        </div>
        <h5 class="song-duration">${Math.floor(song.song_duration / 60)}:${String(song.song_duration % 60).padStart(2,'0')}</h5>`
    return div;
}