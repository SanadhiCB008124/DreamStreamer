import song1 from './song1.mp3'
import song2 from './song2.mp3'
import song3 from './song3.mp3'
import image1 from './image1.jpg'
import image2 from './image2.jpg'
import image3 from './image3.jpg'
import cover1 from './cover1.png'
import cover2 from './cover2.png'
import cover3 from './cover3.png'
import cover4 from './cover4.png'
import trending from './trending.jpg'
import home from './home.svg'
import notification from './notification.png'
import rightArrow from './rightarrow.svg'
import leftArrow from './leftarrow.svg'
import plus from './plus.svg'
import search from './search.svg'
import stack from './stack.svg'
import shuffle from './shuffle.svg'
import play from './play.svg'
import prev from './previous.svg'
import next from './next.svg'
import loop from './loop.svg'
import mic from './mic.svg'
import queue from './queue.svg'
import speaker from './speaker.svg'
import volume from './volume.svg'
import mini_player from './mini_player.svg'
import zoom from './zoom.svg'
import clock from './clock.svg'
import pause from './pause.svg'
import artist from './artist.svg'
import album from './album.svg'
import genre from './genre.svg'
import login from './login.jpg'
import Mars from './Mars.png'
import grande from './grande.png'
import ed from './ed.png'
import lana from './lana.png'
import styles from './styles.png'

export const assets={

    song1,
    song2,
    song3,
    image1,
    image2,
    image3,
    cover1,
    cover2,
    cover3,
    cover4,
    trending,
    home,
    notification,
    rightArrow,
    leftArrow,
    search,
    stack,
    plus,
    shuffle,
    play,
    prev,
    next,
    loop,
    mic,
    queue,
    speaker,
    volume,
    mini_player,
    zoom,
    clock,
    pause,
    album,
    artist,
    genre,
    login,
    Mars,
    grande,
    ed,
    lana,
    styles
}


export const albumsData=[

   {
    id:0,
    name:"Top 50 Global",
    image:cover1,
    desc:" Your weekly update of most played tracks",
    bgColor:"#2a4365",
    likes:"1,323,154",
    streams:"3,098,092",

   } ,
   {
    id:1,
    name:"Top 50 Brazil",
    image:cover2,
    desc:" Your weekly update of most played tracks",
    bgColor:"#2b4365",
    likes:"123,054",
    streams:"1,098,092",

   },
   {
    id:2,
    name:"Trending Brazil",
    image:cover3,
    desc:" Your weekly update of most played tracks",
    bgColor:"#742a2a",
    likes:"2,098,092",
    streams:"4,098,092",
   },
   {
    id:2,
    name:"Trending Brazil",
    image:cover4,
    desc:" Your weekly update of most played tracks",
    bgColor:"#742a2a",
    likes:"2,098,092",
    streams:"4,098,092",
   }

]

export const songsData=[
    {
        id:0,
        name:"Song One",
        image:image1,
        file:song1,
        desc:"Put a smile on your face with these happy tunes",
        duration:"3.00"
    },
    {
        id:1,
        name:"Song Two",
        image:image2,
        file:song2,
        desc:"Put a smile on your face with these happy tunes",
        duration:"3.00"
    },
    {
        id:2,
        name:"Ghost",
        image:image3,
        file:song3,
        desc:"Put a smile on your face with these happy tunes",
        duration:"3.00"
    },

]


export const ArtistsData=[
    {
        id:0,
        name:"Bruno Mars",
        image:Mars,

    },
    {
        id:1,
        name:"Ariana Grande",
        image:grande,

    },
    {
        id:2,
        name:"Justin Bieber",
        image:styles,
    },
    {
        id:3,
        name:"Ed Sheeran",
        image:ed,
    },
    {
        id:4,
        name:"Lana Del Rey",
        image:lana,
    }
]