#version 300 es
precision highp float;
out vec4 OutColor;

in vec2 DrawPos;
in vec3 DrawNormal;

uniform float Time;
uniform vec3 CamDir;

void main( void )
{
  float nl = max(0.3, dot(DrawNormal, normalize(-CamDir)));

  //OutColor = vec4(DrawNormal, 1);
  OutColor = vec4(vec3(1, 0, 1) * nl, 1);
}

/* VG6 */