function loadFeaturedPage(playlist){
    const featuredContent = document.getElementById("featured-content");

    const playlistInfo = createFeaturedPlaylistElement(playlist);
    featuredContent.appendChild(playlistInfo);

    const songList = createFeaturedSongList(playlist);
    featuredContent.appendChild(songList);

}

function selectRandomPlaylist() {
    var randomPlaylistIndex = Math.floor(Math.random() * playlistData.length)
    return playlistData[randomPlaylistIndex];
}

function createFeaturedPlaylistElement(playlist) {
    const div = document.createElement('article');
    div.className = "featured-playlist-info"
    div.innerHTML = `
        <img src='${playlist.playlist_art}' class='featured-cover' alt="">
        <h2 class="featured-name">${playlist.playlist_name}</h2>
    `
    return div;
}


function createFeaturedSongList(playlist) {
    const div = document.createElement('article');
    div.className = 'featured-song-list';
    
    for(i = 0; i < playlist.songs.length; ++i){
        const songElement = createSongElement(playlist.songs[i]);
        div.appendChild(songElement);
    }

    return div;

}   


function createSongElement(song) {

    const div = document.createElement('div');  
    div.className = 'song-tile'
    div.innerHTML = `
        <img src='${song.song_art}' class='featured-song-art' alt="">
        <div style='display: block;'>
        <h3 class='featured-song-title'>${song.song_title}</h3> 
        <p class="featured-song-info">${song.song_author}</p>
        <p class="featured-song-info">${song.albumn_name}</p>
        <p class="featured-song-info">${Math.floor(song.song_duration / 60)}:${String(song.song_duration % 60).padStart(2,'0')}</p>
        </div>
        `
    return div
}

const featuredPlaylist = selectRandomPlaylist();
console.log(featuredPlaylist);
loadFeaturedPage(featuredPlaylist);