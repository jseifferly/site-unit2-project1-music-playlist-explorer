const modal = document.getElementById("modal");
const songsArray = playlistData.map((currentValue) => {return currentValue.songs})


//**--------------------------DYNAMICALLY LOAD PLAYLIST DATA--------------------------**//

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

//Create a playlist element to add
function createPlaylistElement(playlist){
    const div = document.createElement('article');
    div.className = 'playlist';
    div.innerHTML = `
        <img class="playlist-cover" src=${playlist.playlist_art} alt="">
        <h3 class="playlist-title">${playlist.playlist_name}</h3>
        <h4 class="playlist-creator-name">${playlist.playlist_author}</h4>
        <div class="like-count">
        <p class="like-icon">&#128420;</p>
        <p class="like-number">${playlist.like_count}</p>
        </div>
    `;
    return div;
}

//Create a no playlist message
function noPlaylistsMessage() {
    const div = document.createElement('div');
    div.className = 'no-playlists';
    div.innerHTML = `No playlists added...`
    return div
}

//Load the playlist data
loadPlaylistData();
const playlists = Array.from(document.querySelectorAll(".playlist"));

//-------------------------------------------------------------------------------//



//**--------------------------MODAL FUNCTIONALLITY AND DYNAMICALLY POPULATE MODAL--------------------------**//

function openModal(playlist) {
    populateModal(playlist);
    modal.style.display = "block";

    const shuffleBtn = document.querySelector('.shuffle-button')
    
    shuffleBtn.addEventListener('click', () => {
        const modal_content = document.getElementById('modal-content');
        let songList = document.querySelector('.song-list');
        modal_content.removeChild(songList)
        
        const shuffledSongs = shuffleArray(playlist.songs)
        songList = createModalSongList(shuffledSongs)
        modal_content.appendChild(songList)
    })
}

//Create event listners for each playlist and display modal on click
for(i = 0; i < playlists.length; i++){
    playlists[i].addEventListener("click", (event) => {

        let clickedIndex = -1;

        if(event.target.className == 'playlist'){
            clickedIndex = playlists.indexOf(event.target)
        }else if(event.target.className == 'like-icon' || event.target.className == 'like-number'){
            return;
        }else {
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

//Add playlist specifc data to our modal
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

//-------------------------------------------------------------------------------//

//**--------------------------CREATE EACH OF THE MODAL ELEMENTS TO ADD--------------------------**//

function createModalHeaderElement(playlist){
    const div = document.createElement('div');
    div.className = 'modal-header';

    div.innerHTML = `<img id="modal-playlist-cover" src="${playlist.playlist_art}" alt="">
                    <div class="playlist-info">
                    <h2 id="modal-title">${playlist.playlist_name}</h2>
                    <h3 id="modal-creator">${playlist.playlist_author}</h3>
                    <button type="button" class="shuffle-button">Shuffle</button>
                    </div>
    `
    return div;
}

function updateSongList(songs) {

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

//-------------------------------------------------------------------------------//


//**--------------------------LIKE BUTTON FUNCTIONALITY--------------------------**//

//add event listners
const likeIcons = playlists.map((currentValue) => { return currentValue.querySelector('.like-icon') })
const likeCounts = playlists.map((currentValue) => { return currentValue.querySelector('.like-number') })

likeIcons.forEach ( likeIcon => {
    likeIcon.addEventListener("click", (event) => {

        const clickedIndex = likeIcons.indexOf(likeIcon);

        //Get new like count
        if(playlistData[clickedIndex].liked){
            playlistData[clickedIndex].like_count--;
            playlistData[clickedIndex].liked = false;
            likeIcon.innerHTML = `&#128420;`
        }else {
            playlistData[clickedIndex].like_count++;
            playlistData[clickedIndex].liked = true;
            likeIcon.innerHTML = `&#129505;`
        }

        //Update the like count
        updateLikeCount(clickedIndex, playlistData[clickedIndex].like_count);

    })
})

//Take a like count element and update the value
function updateLikeCount(likeCountIndex, count) {
    likeCounts[likeCountIndex].textContent = `${count}`
}

//-------------------------------------------------------------------------------//


//**--------------------------SHUFFLE SONGS FEATURE--------------------------**/

function shuffleArray(arr){
    for(i = arr.length - 1; i > 0; i--){
        let randIndex = Math.floor(Math.random() * (i - 1));
        let temp = arr[i];
        arr[i] = arr[randIndex];
        arr[randIndex] = temp;
    }
    return arr
}

//-------------------------------------------------------------------------------//
