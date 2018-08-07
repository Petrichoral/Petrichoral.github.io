precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
varying vec3 fNormal;
varying vec3 fPosition;

void main()
{
  // Fragment shader normal
  fNormal = normalize(normal);
  vec4 pos = modelViewMatrix * vec4(position, 1.0);
  // Fragment shader position
  fPosition = pos.xyz;
  gl_Position = projectionMatrix * pos;
}