import { vec3 , mat4, cam, matView, matrRotateY, matrRotateX } from "./mth/mth_def";
import {render, renderInit} from "./mylib"
import { Timer } from "./res/timer";
import { shader } from "./res/shader";
import { initPrim1 } from "./res/prim";
import { tetr } from "./plat/tetr";
import { cube } from "./plat/cube";

const frameW = 300;
const frameH = 300;
const camUp = vec3(0, 1, 0);
const projDist = 0.1;
const projSize = 0.1;
const farClip = 300;
const camLoc = vec3(0, 0.5, 2);

// GL context
let camera, flag;

class rend {
  gl;
  shd;
  prg;
  canvas;
  camera;
  worldLoc;
}

class _getGL {
  constructor(canvasName) {
    this.canvas = document.querySelector("#" + canvasName); 
    this.gl = this.canvas.getContext("webgl2");
  
    this.gl.enable(this.gl.DEPTH_TEST)
    if (this.gl == null) {
      alert("WebGL2 not supported");
      return null;
    }
    this.gl.clearColor(0.3, 0.47, 0.8, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shd = shader("def", this);
    this.flag = false;

    /* Set camera*/
    this.camera = cam();
    this.camera.set(camLoc, vec3(0), camUp);
    this.camera.setProj(projSize, projDist, farClip);
    this.camera.setSize(frameW, frameH);
    
  }
  render(init, draw) {
    const anim = () => {
      this.gl.clearColor(0.30, 0.47, 0.80, 1);
  
      if (this.flag) {
        this.shd.apply(this);
        render(this);
        draw();
      } else {
        if (this.shd.id != null) {
          this.shd.apply(this);
          this.shd.updateShaderData(this)
          init();
          this.prg = this.shd.id;
          this.flag = true;
          
        }
      }
      
      window.requestAnimationFrame(anim);
    }
    anim();
  }
}

function getGL(...args) {
  return new _getGL(...args);
}

// load GL function
function loadGL() {
  let rnd = new rend();
  let tetrahedron;

  rnd.canvas = document.querySelector("#glCanvas"); 
  rnd.gl = rnd.canvas.getContext("webgl2");

  rnd.gl.enable(rnd.gl.DEPTH_TEST);
  if (rnd.gl == null) {
    alert("WebGL2 not supported");
    return;
  }
  rnd.gl.clearColor(0.3, 0.47, 0.8, 1);
  rnd.gl.clear(rnd.gl.COLOR_BUFFER_BIT);

  ///shaderCreation(gl, element);
  rnd.shd = shader("def", rnd);
  flag = false;
  
  rnd.camera = cam();
  rnd.camera.set(vec3(0, 0.5, 2), vec3(0, 0, 0), camUp);
  rnd.camera.setProj(projSize, projDist, farClip);
  rnd.camera.setSize(frameW, frameH);

  const anim = () => {
    rnd.gl.clearColor(0.30, 0.47, 0.80, 1);

    if (flag) {
      rnd.shd.apply(rnd);
      render(rnd);
      tetrahedron.draw(matrRotateY(45 * window.t).mul(matrRotateX(30 * window.t)));
    } else {
      if (rnd.shd.id != null) {
        rnd.shd.apply(rnd);
        rnd.shd.updateShaderData(rnd);

        rnd.shd.updateShaderData(rnd)
        rnd.prg = rnd.shd.id;
        flag = true;
        tetrahedron = tetr(1, rnd);
      }
    }
    
    window.requestAnimationFrame(anim);
  }
  anim();
}

window.addEventListener("load", () => {
  let canv1 = getGL("glCanvas1");
  let canv2 = getGL("glCanvas2");
  canv1.prim = cube(1, canv1);
  canv2.render(() => {
    canv2.cube = cube(1, canv2);
  }, () => {
    canv2.cube.draw(matrRotateY(45 * window.t).mul(matrRotateX(30 * window.t)));
  });
  canv1.render( () => {
    canv1.tetr = tetr(1, canv1);
  }, () => {
    canv1.tetr.draw(matrRotateY(45 * window.t).mul(matrRotateX(30 * window.t)));
  })
})

