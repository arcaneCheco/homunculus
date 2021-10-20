uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uProgress;
uniform float uScale;
uniform sampler2D uDistortion;

varying vec2 vUv;

void main() {
    vec2 nUv = vUv;

    vec2 centeredUv = 2.* vUv - vec2(1.);

    centeredUv += 0.1 * cos(uScale * 3. * centeredUv.yx + uTime + vec2(1.2, 3.4));
    centeredUv += 0.1 * cos(uScale * 3.7 * centeredUv.yx + 1.4 * uTime + vec2(2.2, 3.4));
    centeredUv += 0.1 * cos(uScale * 5. * centeredUv.yx + 2.6 * uTime + vec2(4.2, 1.4));
    centeredUv += 0.3 * cos(uScale * 7. * centeredUv.yx + 3.6 * uTime + vec2(10.2, 3.4));


    nUv = vUv + centeredUv;
    nUv.x = mix(vUv.x, length(centeredUv), uProgress);
    nUv.y = mix(vUv.y, 0.5, uProgress);

    vec4 distor = texture2D(uDistortion, vUv);


    vec4 color = texture2D(tDiffuse, nUv);
    gl_FragColor = color;
}