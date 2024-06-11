#version 300 es
precision highp float;
in vec3 InPosition;
in vec3 InNormal;

uniform float Time;
uniform vec3 Mouse;
uniform mat4 World;
uniform mat4 VP;

out vec2 DrawPos;
out vec3 DrawNormal;

void main( void )
{
  gl_Position =  (VP * World ) * vec4(InPosition, 1);

  DrawNormal = mat3(transpose(inverse(World))) * InNormal;
  //DrawNormal = InNormal;
}
/* VG6 */