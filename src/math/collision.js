export function getBounds(e) {
  const left = e.position.x - e.size.x * e.anchor.x;
  const right = left + e.size.x;

  const top = e.position.y - e.size.y * e.anchor.y;
  const bottom = top + e.size.y;

  return { left, right, top, bottom };
}

export function aabbCollision(a, b) {
  const A = getBounds(a);
  const B = getBounds(b);

  return (
    A.left < B.right && A.right > B.left && A.top < B.bottom && A.bottom > B.top
  );
}

export function resolveCollision(a, b) {
  const A = getBounds(a);
  const B = getBounds(b);

  if (
    A.right <= B.left ||
    A.left >= B.right ||
    A.bottom <= B.top ||
    A.top >= B.bottom
  ) {
    return;
  }

  const overlapX = Math.min(A.right - B.left, B.right - A.left);
  const overlapY = Math.min(A.bottom - B.top, B.bottom - A.top);

  const aCenterX = (A.left + A.right) / 2;
  const bCenterX = (B.left + B.right) / 2;
  const aCenterY = (A.top + A.bottom) / 2;
  const bCenterY = (B.top + B.bottom) / 2;

  if (overlapX < overlapY) {
    if (aCenterX < bCenterX) {
      a.position.x -= overlapX;
    } else {
      a.position.x += overlapX;
    }
    a.velocity.x = 0;
  } else {
    if (aCenterY < bCenterY) {
      a.position.y -= overlapY;
      if (a.velocity.y >= 0) {
        a.isGrounded = true;
      }
    } else {
      a.position.y += overlapY;
    }
    a.velocity.y = 0;
  }
}
