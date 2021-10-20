uniform sampler2D uImage;
varying vec2 vUv;

void main() {
    vec4 image = texture2D(uImage, vUv);
    gl_FragColor = vec4(vUv, 1., 1.);
    gl_FragColor = image;
}