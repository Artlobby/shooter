import * as boundaries from './boundaries';
import { gameWidth } from './boundaries';
import { rectIntersect } from './collisionDetection';
import { IEnemy } from './enemies';
import { IXShipStateData } from './main';
import { deg } from './utils';

export function moveXShip(
  xShipState: IXShipStateData,
  isMoveLeft = false,
  isMoveRight = false,
  {
    leftBoundary = boundaries.leftBoundary,
    rightBoundary = boundaries.rightBoundary,
    mouseX,
  }: {
    leftBoundary?: number;
    rightBoundary?: number;
    mouseX?: number;
  } = {}
) {
  const MAX_ROTATION = 45;
  const ROTATION_SPEED = 1.4;

  if (mouseX) {
    xShipState.positionX = gameWidth * mouseX - gameWidth / 2;
  } else if (isMoveLeft) {
    xShipState.positionX =
      xShipState.positionX <= leftBoundary
        ? leftBoundary
        : xShipState.positionX - 0.2;

    xShipState.rotationY =
      xShipState.rotationY <= deg(-MAX_ROTATION)
        ? deg(-MAX_ROTATION)
        : xShipState.rotationY - deg(ROTATION_SPEED);
  } else if (isMoveRight) {
    xShipState.positionX =
      xShipState.positionX >= rightBoundary
        ? rightBoundary
        : xShipState.positionX + 0.2;

    xShipState.rotationY =
      xShipState.rotationY >= deg(MAX_ROTATION)
        ? deg(MAX_ROTATION)
        : xShipState.rotationY + deg(ROTATION_SPEED);
  } else if (xShipState.rotationY !== 0) {
    if (xShipState.rotationY > 0) {
      xShipState.rotationY -= deg(ROTATION_SPEED / 2);
    } else {
      xShipState.rotationY += deg(ROTATION_SPEED / 2);
    }
  }
}

export function destroyXShip(xShipState: IXShipStateData) {
  if (xShipState.opacity >= 0) {
    xShipState.rotationY += 0.1;
    xShipState.scaleX -= 0.01;
    xShipState.scaleY -= 0.01;
    xShipState.scaleX -= 0.01;
    xShipState.positionY += 0.1;
    xShipState.opacity -= 0.01;
  }
}

export function detectEnemyCollisionAgainstXShip(
  xShipState: IXShipStateData,
  enemies: IEnemy[],
  {
    collisionCallback,
  }: {
    collisionCallback?: (enemy: IEnemy) => void;
  } = {}
) {
  enemies.forEach(enemy => {
    const enemyBox = {
      min: {
        x: enemy.x - 0.5,
        y: enemy.y - 0.5,
      },
      max: {
        x: enemy.x + 0.5,
        y: enemy.y + 0.5,
      },
    };
    const xShipBox = {
      min: {
        x: xShipState.positionX - 0.5,
        y: xShipState.positionY - 0.5,
      },
      max: {
        x: xShipState.positionX + 0.5,
        y: xShipState.positionY + 0.5,
      },
    };

    if (rectIntersect(enemyBox, xShipBox)) {
      if (collisionCallback) {
        collisionCallback(enemy);
      }
    }
  });
}
