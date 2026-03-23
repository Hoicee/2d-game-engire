export function getBounds(e) {
  const left = e.position.x - e.size.x * e.origin.x;
  const right = left + e.size.x;

  const top = e.position.y - e.size.y * e.origin.y;
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
