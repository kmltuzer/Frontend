// ------------------ NAV SECTION -------------------------
window.addEventListener('scroll', () => {
    document.body.querySelector('nav').classList.toggle('show-shadow', scrollY > 0);
});
// ------------------ SECTION OBSERVER -------------------------

const [...sections] = document.querySelectorAll('section')
function showActiveLink(entries) {
    entries.forEach(entry => {
        const elem = document.documentElement.clientWidth > 800 
            ? '.nav__menu:first-of-type .active1' : '.nav__menu:last-of-type .active2';

        const id = entry.target.id;
        const color = id === 'contact' ? '#333' : 'var(--clr-primary)'
        const marker = document.querySelector(`${elem}`);
        const activeLink = document.querySelector(`${elem}`).parentElement.querySelector(`li [data-sec=${id}]`);
        const coords = activeLink.getBoundingClientRect();
        const directions = {
            width : coords.width,
            height : coords.height,
            left : coords.left,
            top : coords.top,
        };
        if (entry.isIntersecting) {
            document.querySelector(`${elem}`).parentElement.querySelectorAll('li a')
                .forEach( a => a.style.color = 'var(--clr-dark)');
            marker.style.left = `${directions.left}px`;
            marker.style.top = `${directions.top}px`;
            marker.style.width = `${directions.width}px`;
            marker.style.height = `${directions.height}px`;
            marker.style.backgroundColor = color;
            activeLink.style.color = 'white';
        }
    });
}
let options;
document.addEventListener('DOMContentLoaded', () => {
    options = document.body.clientWidth > 800 ? {threshold : 0.4} : {threshold : 0.2}
    const observer = new IntersectionObserver(showActiveLink, options)
    sections.forEach( section => observer.observe(section) )

});
// ------------------ ABOUT SECTION -------------------------

const showmore = document.querySelector('.about__textarea__showmore')
showmore.addEventListener('click', e => {
    e.target.parentElement.querySelector('.about__textarea__showmore__desc').classList.toggle('d-none');
});

// ------------------ SKILL AREA -------------------------

const [...targets] = document.querySelectorAll('.skill__main');
const progress = targets.map( target => target.querySelector('.item__progress') );
const percentage = targets.map( target => target.querySelector('h5:last-child').textContent  );
progress.forEach( (prgs,index) => prgs.style.width = `${percentage[index]}` );


function showskill (e) {
    const targets = e.target.parentElement.parentElement.querySelectorAll('.skill__main');
    targets.forEach( target => target.classList.toggle('d-none') );

}
const openSkill = document.querySelectorAll('.skill__header .fa-angle-down');
openSkill.forEach( angle => angle.addEventListener('click', showskill) )

// ------------------ HIDDEN MENU -------------------------
function openMenu (e) {
    options = document.body.clientWidth > 800 ? {threshold : 0.4} : {threshold : 0.2}
    const observer = new IntersectionObserver(showActiveLink, options)
    sections.forEach( section => observer.observe(section) )

    document.querySelector('.nav__menu:last-of-type').classList.toggle('d-none');
    this.classList.toggle('fa-times')

}
document.querySelector('nav .fa-solid').addEventListener('click', openMenu)

