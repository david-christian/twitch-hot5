/* eslint prefer-template: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint camelcase: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint arrow-body-style: 0 */

// 將拿到的資料轉換成我們需要的資料格式
function dataHandle(name, cb) {
  /*
  const game = new XMLHttpRequest();
  game.open('GET', 'https://api.twitch.tv/kraken/streams/?game=' + name + '&limit=20', true);
  game.setRequestHeader('Client-ID', '2li8r2rqt0soycm7gj26m766zgmkou');
  game.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  game.onload = () => {
    if (game.status >= 200 && game.status < 400) {
      const game__data = JSON.parse(game.response);
      const data = game__data.streams;
      cb(data); // 我在他的裡面呼叫了函式，因此我可以拿到這裡面的東西
    }
  };
  game.send();
  */
  const url = 'https://api.twitch.tv/kraken/streams/?game=' + name + '&limit=20';
  fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Client-ID': '2li8r2rqt0soycm7gj26m766zgmkou',
      Accept: 'application/vnd.twitchtv.v5+json',
    }),
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        response.json().then((text) => {
          return text;
        }).then((arr) => {
          return arr.streams;
        }).then((data) => {
          cb(data);
        });
      }
    });
}

// 將資料帶進 htm 裡
function screenAppears(data) {
  document.querySelector('.results').innerHTML = '';
  for (const s of data) {
    const preview = s.preview.large;
    const logo = s.channel.logo;
    const title = s.channel.status;
    const name = s.channel.name;
    const url = s.channel.url;
    const cube = document.createElement('div');
    cube.classList.add('result');
    cube.innerHTML = `<a href = ${url}>
    <div class='result__top'>
    <img src = ${preview}>
    </div>
    <div class='result__bottom'>
      <div class='result__bottom__left'><img src = ${logo}></div>
      <div class='result__bottom__right'>
        <div class='result__bottom__title'>${title}</div>
        <div class='result__bottom__channel'>${name}</div>
      </div>
    </div>`;
    document.querySelector('.results').appendChild(cube);
  }
}
function topGames(cb) {
  const topUrl = 'https://api.twitch.tv/kraken/games/top?limit=5';
  fetch(topUrl, {
    method: 'GET',
    headers: new Headers({
      'Client-ID': '2li8r2rqt0soycm7gj26m766zgmkou',
      Accept: 'application/vnd.twitchtv.v5+json',
    }),
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        response.json().then((text) => {
          return text;
        }).then((data) => {
          cb(data);
        });
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  topGames((data) => {
    const newname__ary = [];
    for (let i = 0; i < data.top.length; i += 1) {
      newname__ary[i] = data.top[i].game.name;
    }
    for (const i of newname__ary) {
      const navlist = document.createElement('li');
      navlist.classList.add('navbar__list__li');
      navlist.innerHTML = i;
      document.querySelector('.navbar__list').appendChild(navlist);
    }
    dataHandle(newname__ary[0], (gameData) => {
      screenAppears(gameData);
    });
    for (const j of newname__ary) {
      document.querySelector('.navbar__list').addEventListener('click', (e) => {
        if (e.target.innerText === j) {
          dataHandle(j, (result) => {
            screenAppears(result);
          });
        }
      });
    }
  });
});
// 出現遊戲名列表
/* const request__top = new XMLHttpRequest();
request__top.open('GET', 'https://api.twitch.tv/kraken/games/top?limit=5', false);
request__top.setRequestHeader('Client-ID', '2li8r2rqt0soycm7gj26m766zgmkou');
request__top.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
request__top.addEventListener('load', () => {
  if (request__top.status >= 200 && request__top.status < 400) {
    const name__ary = JSON.parse(request__top.response);
    const newname__ary = [];
    for (let i = 0; i < name__ary.top.length; i += 1) {
      newname__ary[i] = name__ary.top[i].game.name;
    }
    for (const i of newname__ary) {
      const navlist = document.createElement('li');
      navlist.classList.add('navbar__list__li');
      navlist.innerHTML = i;
      document.querySelector('.navbar__list').appendChild(navlist);
    }
    // 出現第一個畫面
    dataHandle(newname__ary[0], (data) => {
      screenAppears(data);
    });
    // 切換各遊戲實況
    for (const j of newname__ary) {
      document.querySelector('.navbar__list').addEventListener('click', (e) => {
        if (e.target.innerText === j) {
          dataHandle(j, (data) => {
            screenAppears(data);
          });
        }
      });
    }
  } else {
    alert('error');
  }
});
request__top.send(); */
