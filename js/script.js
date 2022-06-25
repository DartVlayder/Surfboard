const openBtn = document.querySelector(".hamburger");
const menu = document.querySelector(".fullscreen-menu");
const closeMenu = document.querySelector(".fullscreen-menu__close");

openBtn.addEventListener("click", e => {
    menu.classList.add("active");
});

closeMenu.addEventListener("click", e => {
    menu.classList.remove("active");
})

menu.addEventListener("click", e => {
    if(e.target === menu) {
        closeMenu.click();
    } 
})