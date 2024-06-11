import { prim, vertex } from "./res/prim";
import { vec3 } from "./mth/mth_vec3";
import { matrRotateX, matrRotateY, matrRotateZ } from "./mth/mth_mat4";
import { tetr } from "./plat/tetr";
import { cube } from "./plat/cube";

let timeLoc, rnd,
  mouseLoc,
  mousePosX = 0,
  MouseZ = 0,
  mousePosY = 0;

let x = 0,
  OldMouseX,
  OldMouseY;

let IsMouseDown = false;

let tetrahedron, cub;

// Main render frame function.
export function render(rend) {
  rend.gl.clear(rend.gl.COLOR_BUFFER_BIT);

  const date = new Date();
  window.t =
    date.getMinutes() * 60 +
    date.getSeconds() +
    date.getMilliseconds() / 1000;;
  

  if (rend.shd.timeLoc != -1) {
      rend.gl.uniform1f(rend.shd.timeLoc, window.t);
  }
  if (rend.shd.mouseLoc != -1) {
    rend.gl.uniform3f(rend.shd.mouseLoc, mousePosX, mousePosY, MouseZ);
  }
  if (rend.shd.camDirLoc != -1)
    rend.gl.uniform3f(rend.shd.camDirLoc, false, rend.camera.Dir.x, rend.camera.Dir.y, rend.camera.z);

  //tetrahedron.draw(matrRotateY(t * 75).mul(matrRotateX(t * 30)));
  //cub.draw(matrRotateY(t * 75).mul(matrRotateX(t * 30)));
  
} /* End of 'render' finction */

function fractalMove(event) {
  let X = event.clientX,
    Y = event.clientY;

  if (IsMouseDown) {
    mousePosX -= X - OldMouseX;
    mousePosY += Y - OldMouseY;
    (OldMouseY = Y), (OldMouseX = X);
  }
}

export function renderInit(render) {
  rnd = render;
  rnd.canvas.addEventListener("mousedown", (event) => {
    OldMouseX = event.clientX;
    OldMouseY = event.clientY;
    IsMouseDown = true;
  });
  rnd.canvas.addEventListener("mousemove", (event) => {
    fractalMove(event);
  });
  rnd.canvas.addEventListener("mouseup", () => {
    IsMouseDown = false;
  });
  rnd.canvas.addEventListener("mouseout", () => {
    IsMouseDown = false;
  });
  rnd.canvas.addEventListener("mousewheel", (event) => {
    MouseZ += event.wheelDelta / 40000;
  });
}

console.log("Done.");
