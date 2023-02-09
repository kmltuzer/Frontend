// CIRCLE TEXTS
const [...text] = document.querySelectorAll('.circle-text');
const nodes = text.map( txt => txt.textContent.split('') );
text.forEach(txt => txt.innerHTML = '' )
nodes.forEach( (node, i) => {
    node.forEach( (txt,index) => {
        text[i].innerHTML += `<span style="--rot: ${index * 14}deg;">${txt}</span>`
    })
} );

// MENU TOGGLE

function checkResizing (entries) {
    const links = document.querySelectorAll('.nav__links li a')
    const open = document.querySelector('.bars');
    const close = document.querySelector('.times');
    if (document.body.clientWidth <= 850) {
        [close, ...links].forEach( btn => btn.addEventListener('click', e => {
            document.querySelector('.nav__links').style.display = 'none';
            open.style.display = 'flex';
            close.style.display = 'none';
        }) );
        open.addEventListener('click', e => {
            document.querySelector('.nav__links').style.display = 'flex';
            open.style.display = 'none';
            close.style.display = 'flex';
        } );
    } else document.querySelector('.nav__links').removeAttribute('style');    

    // SWIPER JS
    let size;
    var swiper = new Swiper(".mySwiper", {
        slidesPerView:
        document.body.clientWidth <= 850
            ? document.body.clientWidth <= 500
            ? 1
            : 2
            : 3,
        spaceBetween: 0,
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
        },
    });
}
const observer = new ResizeObserver(checkResizing);
observer.observe(document.body);

// NAV SCROLL
const nav = document.querySelector('nav');
window.addEventListener('scroll', e => {
    window.scrollY > 0 ? nav.classList.add('onscroll') : nav.classList.remove('onscroll');
});