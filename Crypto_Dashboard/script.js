const ctx = document.querySelector("#chart");

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "BTC",
        data: [
          29_374, 35_537, 33_456, 49_631, 42_295, 33_745, 25_800, 37_055,
          52_527, 55_241, 58_187, 49_019,
        ],
        borderColor: "red",
        borderWidth: 2,
      },
      {
        label: "ETH",
        data: [
          37_712, 26_080, 32_824, 38_300, 33_500, 45_700, 42_200, 51_400, 49_200, 33_600, 56_900,
          30_412,
        ],
        borderColor: "blue",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
  },
});

// MENU BUTTONS
const [open,close] = [
  document.querySelector('.menu__btn'),
  document.querySelector('.close__btn')
];
open.addEventListener('click', e => {
  document.querySelector('.sidebar').classList.remove('d-none');
});
close.addEventListener('click', e => {
  document.querySelector('.sidebar').classList.add('d-none');
});

// SIDEBAR ACTIVE
const links = document.querySelectorAll('.sidebar header a');
function activate (e) {
  e.preventDefault();
  links.forEach(link => link.classList.remove('sidebar__active'))
  this.classList.add('sidebar__active');
}
links.forEach( link => link.addEventListener('click', activate) );

// SEARCH INPUT
const search = document.querySelector('.search');
search.addEventListener('click', e => {
  search.querySelector('input').classList.remove('hide')
});
search.querySelector('span').addEventListener('click', e => {
  search.querySelector('input').classList.remove('hide')
});

document.addEventListener('click', e => {
  const conditions = [
    e.target !== search,
    e.target !== search.querySelector('span'),
    e.target !== search.querySelector('input')
  ]
  if ( conditions[0] && conditions[1] && conditions[2] ) {
    search.querySelector('input').classList.add('hide');
    search.querySelector('input').value = '';
  }
});

// DARK MODE
const [sun, moon] = document.querySelectorAll('.mode span')
sun.addEventListener('click', e => {
  document.body.classList.remove('night');
  sun.classList.add('active-mode');
  moon.classList.remove('active-mode');
});
moon.addEventListener('click', e => {
  document.body.classList.add('night');
  sun.classList.remove('active-mode');
  moon.classList.add('active-mode');
});