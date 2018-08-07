const Sky = function(name, transform, update) {
  const vertexSource = document.getElementById("texture-vshader").text;
  const fragmentSource = document.getElementById("texture-fshader").text;
  const textureSource = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
  
  const vertices = [-50.0,50.0,50.0,-50.0,-50.0,-50.0,-50.0,-50.0,50.0,-50.0,50.0,-50.0,50.0,-50.0,-50.0,-50.0,-50.0,-50.0,50.0,50.0,-50.0,50.0,-50.0,50.0,50.0,-50.0,-50.0,50.0,50.0,50.0,-50.0,-50.0,50.0,50.0,-50.0,50.0,50.0,-50.0,-50.0,-50.0,-50.0,50.0,-50.0,-50.0,-50.0,-50.0,50.0,-50.0,50.0,50.0,50.0,50.0,50.0,-50.0,-50.0,50.0,50.0,-50.0,50.0,-50.0,-50.0,-50.0,-50.0,-50.0,50.0,-50.0,50.0,50.0,-50.0,50.0,-50.0,-50.0,50.0,50.0,-50.0,50.0,50.0,50.0,50.0,-50.0,50.0,50.0,50.0,50.0,-50.0,50.0,50.0,-50.0,-50.0,50.0,50.0,-50.0,-50.0,50.0,-50.0,50.0,-50.0,-50.0,50.0,-50.0,50.0,-50.0,-50.0,50.0,50.0,50.0,50.0,50.0,];
  const normals = [-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,];
  const texCoords = [1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,];

  let indices = [];
  for (let i = 0; i < vertices.length / 3; i++) {
    indices[i] = i;
  }
  const vertexCount = indices.length;
  
  const ambientCoeff = 1.0;
  const diffuseCoeff = 0.0;
  const specularCoeff = 0.0;
  const specularExp = 1.0;

  let newSky = Skybox(name, transform, update);
  newSky.vertexSource = vertexSource;
  newSky.fragmentSource = fragmentSource;
  newSky.textureSource = textureSource;
  newSky.vertices = vertices;
  newSky.normals = normals;
  newSky.texCoords = texCoords;
  newSky.indices = indices;
  newSky.vertexCount = vertexCount;
  newSky.coeff = [ambientCoeff, diffuseCoeff, specularCoeff, specularExp];
  return newSky;
}