// SETTING THE NAV BACKGROUND ON SCROLL Y
window.addEventListener('scroll', e => {
    const nav = document.body.querySelector('nav');
    nav.style.transition = 'background-color 0.3s linear';
    if (scrollY > 0) nav.style.backgroundColor = 'var(--clr-primary)';
    else nav.style.backgroundColor = 'transparent';
});

// HIDDEN MENU
const btn = document.querySelector('.nav__hidden__btn')
const menu = document.querySelector('.nav__links__hidden')
function openMenu(e) {
    btn.firstElementChild.classList.toggle('fa-times')
    btn.firstElementChild.classList.toggle('fa-bars')
    menu.classList.toggle('d-none')

}
btn.addEventListener('click', openMenu)

// PLUSES ON FAQs
const pluses = document.querySelectorAll('.fa-plus')
function openAnswer(e) {
    const answer = e.target.parentElement.parentElement.querySelector('.faq__answer');
    answer.classList.toggle('d-none');
}
pluses.forEach( plus => plus.addEventListener('click', openAnswer));