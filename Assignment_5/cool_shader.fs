precision highp float;
uniform float time;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec3 fLight_Position;

// Inherent color of the object, usually an attribute
const vec3 color = vec3(1.0, 1.0, 1.0);

// Coefficients for the various lighting elements.
const float ambient_coeff = 0.1;
const float diffuse_coeff = 0.8;
const float specular_coeff = 1.0;
const float specular_exp = 512.0;

// Coefficients for the variety of reflections for objects.
// Usually these are from the models themselves.
const vec3 ambient_ref = vec3(1.0, 1.0, 1.0);
const vec3 diffuse_ref = vec3(1.0, 1.0, 1.0);
const vec3 specular_ref = vec3(1.0, 1.0, 1.0);

void main() {
  // Light position in Camera Space
  vec3 light_pos = normalize(vec3(0, 0, 1));
  // Normal of the fragment, linearly interpolated
  vec3 normal = fNormal;
  // Comment out the line below to switch from fragment shading to vertex shading!
  /**/
  normal = normalize(normal + normalize(-fPosition));
  /**/
  // Ambient Lighting Calculation
  vec3 ambient = ambient_coeff * ambient_ref;
  // Diffuse Lighting Calculation
  vec3 diffuse = diffuse_coeff * dot(normal, light_pos) * diffuse_ref;
  // Specular Lighting Calculation
  vec3 specular = specular_coeff * pow(max(0.0, dot(normal, light_pos)), specular_exp) * specular_ref;
  // Combine lighting, send to frag color.
  if (sin(fPosition.x * time) > 0.8) { discard; }
  if (cos(fPosition.y * time) > 0.8) { discard; }
  gl_FragColor = vec4((ambient + diffuse + specular) * color, 1.0);
}