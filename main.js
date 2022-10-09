title = "MissileDefense";

description = `

`;
const G = {
	WIDTH: 100,
	HEIGHT: 150,
  BOXHEIGHT : 40,
  BOXWIDTH : 25,
  ENEMY_MIN_BASE_SPEED: 0.1,
  ENEMY_MAX_BASE_SPEED: 0.2
};
let gunHeight = (G.HEIGHT - G.BOXHEIGHT/2) - 23
// http://localhost:4000/?PlanetGrapple

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
};

characters = [
`
  ll
  ll
llllll
llllll
llllll
llllll
`
,
`
ll
ll
`
,
`
llllll
l    l
l    l
llllll 
`
,
`
cccccc
cccccc
cccccc
cccccc
  cc
  cc
`



];


/**
* @typedef {{
  * pos: Vector,
  * speed: number,
  * angle : number,
  * }} Bullet
  */
/**
* @type  { Bullet }
*/
let bullet = {
 pos : vec(50,50),
 speed : 1,
 angle : 270
};

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies = [];

/**
 * @type { number }
 */
 let currentEnemySpeed;

let gameOver = false;

function update() {
  // The init function running at startup
  if (!ticks) {
    bulletReset();
    enemies = [];
  }
  buildingUpdate();
  fireUpdate();
  enemiesUpdate();

}

function buildingUpdate()
{
  //building base
  color('red')
  box(G.WIDTH/2,(G.HEIGHT - G.BOXHEIGHT/2),G.BOXWIDTH,G.BOXHEIGHT)
  //building gun
  color('black');
  char('a',G.WIDTH/2,(G.HEIGHT - G.BOXHEIGHT/2) - 23)
}
function fireUpdate()
{
  char('b',bullet.pos.x,bullet.pos.y);
  if (bullet.angle == 0)
  {
    bullet.pos.x += bullet.speed;
  }
  if (bullet.angle == 90)
  {
    bullet.pos.y += bullet.speed;
  }
  if (bullet.angle == 180)
  {
    bullet.pos.x -= bullet.speed;
  }
  if (bullet.angle == 270)
  {
    bullet.pos.y -= bullet.speed;
  }

  if (input.isJustPressed)
  {
    if (bulletActive())
    {
      bullet.angle = (bullet.angle + 90)%360;
      //change angle
    }
    if (!bulletActive())
    {
      bulletReset()
    }
  }
}

function enemiesUpdate()
{
  if (enemies.length === 0) {
    currentEnemySpeed =
        rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
    for (let i = 0; i < 3; i++) {
      const posX = rnd(0, G.WIDTH);
      const posY = -rnd(i * G.HEIGHT * 0.1);
      enemies.push({ pos: vec(posX, posY) })
    }
  }

  remove(enemies, (e) => {
    e.pos.y += currentEnemySpeed;
    const isCollidingWithBullets = char("d", e.pos).isColliding.char.b;
    const isCollidingWithTower = char("d", e.pos).isColliding.rect.red;
    color("red");
    char("d", e.pos);

    if (isCollidingWithBullets) {
      color("yellow");
      particle(e.pos);
      bulletReset();
    }

    if (isCollidingWithTower) {
      end();
    }

  
    return (isCollidingWithBullets || e.pos.y > G.HEIGHT);
  });

}

function bulletReset()
{
  bullet.pos.x = G.WIDTH/2;
  bullet.pos.y = (G.HEIGHT - G.BOXHEIGHT/2) - 23;
  bullet.angle = 270
}

function bulletActive()
{
  if (bullet.pos.x < G.WIDTH && bullet.pos.x > 0)
  {
    if (bullet.pos.y < G.HEIGHT && bullet.pos.y > 0)
    {
      return true;
    }
  }
  return false;
}

addEventListener("load", onLoad);