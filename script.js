const track = document.getElementById("track");
const slides = document.querySelectorAll(".track img");
const blurBg = document.getElementById("blurBg");
const dotsContainer = document.getElementById("dots");
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const realSlides = ["img/1.jpeg","img/2.jpeg","img/3.jpeg","img/4.jpeg","img/5.jpeg","img/6.jpeg"];
let index = 1;
let startX=0, currentX=0, isDragging=false;

const slideWidth = () => slides[0].clientWidth;
const setPosition = (anim=true) => { track.style.transition = anim?"transform 0.4s ease":"none"; track.style.transform = `translateX(${-index*slideWidth()}px)`; }
setPosition(false);

/* CREATE DOTS */
dotsContainer.innerHTML = "";
realSlides.forEach((_, i)=>{
  const dot=document.createElement("span");
  if(i===0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});

function updateUI(){
  const realIndex = (index-1+realSlides.length)%realSlides.length;
  blurBg.style.backgroundImage = `url(${realSlides[realIndex]})`;
  document.querySelectorAll(".dots span").forEach((dot,i)=>{ dot.classList.toggle("active", i===realIndex); });
}
updateUI();

/* SWIPE LOGIC */
function finishSwipe() {
  isDragging=false;
  const diff = currentX-startX;
  if(diff<-50) index++;
  if(diff>50) index--;
  setPosition();
  track.addEventListener("transitionend", ()=>{
    if(index===slides.length-1) index=1;
    if(index===0) index=slides.length-2;
    setPosition(false);
    updateUI();
  }, {once:true});
}

track.addEventListener("touchstart", e=>{ startX=e.touches[0].clientX; isDragging=true; track.style.transition="none"; });
track.addEventListener("touchmove", e=>{ if(!isDragging) return; currentX=e.touches[0].clientX; track.style.transform=`translateX(${-index*slideWidth()+currentX-startX}px)`; });
track.addEventListener("touchend", finishSwipe);

track.addEventListener("mousedown", e=>{ startX=e.clientX; isDragging=true; track.style.transition="none"; });
window.addEventListener("mousemove", e=>{ if(!isDragging) return; currentX=e.clientX; track.style.transform=`translateX(${-index*slideWidth()+currentX-startX}px)`; });
window.addEventListener("mouseup", finishSwipe);

/* BUTTONS */
prevBtn.addEventListener("click", ()=>{ index--; setPosition(); track.addEventListener("transitionend", ()=>{ if(index===0) index=slides.length-2; setPosition(false); updateUI(); }, {once:true}); });
nextBtn.addEventListener("click", ()=>{ index++; setPosition(); track.addEventListener("transitionend", ()=>{ if(index===slides.length-1) index=1; setPosition(false); updateUI(); }, {once:true}); });

/* AUTOPLAY */
let autoplayTimer = null;
function startAutoplay(){ stopAutoplay(); autoplayTimer=setInterval(()=>{ index++; setPosition(); track.addEventListener("transitionend", ()=>{ if(index===slides.length-1) index=1; setPosition(false); updateUI(); },{once:true}); },4000); }
function stopAutoplay(){ clearInterval(autoplayTimer); }
["touchstart","mousedown"].forEach(e=>track.addEventListener(e, stopAutoplay));
["touchend","mouseup"].forEach(e=>track.addEventListener(e, ()=>setTimeout(startAutoplay,3000)));
startAutoplay();

/* MUSIC BUTTON */
musicBtn.addEventListener("click", ()=>{
  music.muted = !music.muted;
  musicBtn.textContent = music.muted ? "🎵 Вкл. музыка" : "🔇 Откл. музыка";
});
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "❤️";

  // экран бойымен кездейсоқ орын
  heart.style.left = Math.random() * window.innerWidth + "px";

  // кездейсоқ өлшем
  heart.style.fontSize = 15 + Math.random() * 25 + "px";

  // кездейсоқ ұзақтық
  heart.style.animationDuration = 4 + Math.random() * 3 + "s";

  document.getElementById("hearts").appendChild(heart);

  // анимация аяқталған соң өшіру
  heart.addEventListener("animationend", () => heart.remove());
}

// әр 0.5 секунд сайын жасалады
setInterval(createHeart, 500);
