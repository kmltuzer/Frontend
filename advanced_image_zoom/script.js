const img = document.querySelector('.showcase__img');
const [range, size] = document.querySelectorAll('.inputs input');
const glass = document.querySelector('.glass');
const layer = document.querySelector('.layer');

const thumbs = document.querySelectorAll('.thumb__img');
thumbs.forEach(thumb => thumb.addEventListener('click', e => {
    const url = e.currentTarget.getAttribute('style').match(/url[()./]*\w+[()./]*\w*[.]\w+[)]*/)[0];
    img.style.setProperty('--bg-i', `${url}`)
    glass.style.setProperty('--bg-i', `${url}`)
}) );

const borderW = (img.parentElement.offsetWidth - img.parentElement.clientWidth) / 2
let left_ = img.parentElement.offsetLeft + borderW
let top_ = img.parentElement.offsetTop + borderW
let condition = false;

window.addEventListener('resize', e => {
    left_ = img.parentElement.offsetLeft + borderW;
    top_ = img.parentElement.offsetTop + borderW;
});
range.addEventListener('input', e => glass.style.setProperty('--m', +range.value) );
size.addEventListener('input', e => glass.style.setProperty('--rad', `${+size.value * 10}px`) );
layer.addEventListener('click', e => condition ? condition = false : condition = true );
layer.addEventListener('mousemove', e => {
    if ( condition ) {
        glass.style.setProperty('--x', `${e.x - left_}px`);
        glass.style.setProperty('--y', `${e.y - top_}px`);
    };
});