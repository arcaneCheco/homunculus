import * as THREE from "three";
import { WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Pane } from "tweakpane";
import p1VertexShader from "./shaders/p1/vertex.glsl";
import p1FragmentShader from "./shaders/p1/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import img1 from "../img/1.jpg";
import img2 from "../img/2.jpg";
import img3 from "../img/3.jpg";
import brush from "../img/burash01.png";

class Sketch {
  constructor(_options) {
    this.time = 0;
    this.scene = new THREE.Scene();
    this.container = _options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 2);
    this.renderer = new WebGLRenderer();
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.pane = new Pane();
    this.addTextures();
    this.addDummy();
    this.initPost();
    this.render();
  }
  addTextures() {
    this.urls = [img1, img2, img3];
    this.textureLoader = new THREE.TextureLoader();
    this.textures = this.urls.map((url) => this.textureLoader.load(url));
  }

  addDummy() {
    this.geometry = new THREE.PlaneGeometry(1, 1.6299, 1, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uImage: { value: null },
      },
      side: THREE.DoubleSide,
    });

    this.meshes = [];
    this.textures.forEach((tex, i) => {
      const material = this.material.clone();
      material.uniforms.uImage.value = tex;
      const mesh = new THREE.Mesh(this.geometry, material);
      this.meshes.push(mesh);
      this.scene.add(mesh);
      mesh.position.x = (i - 1) * 1.5;
    });
  }
  initPost() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.brush = this.textureLoader.load(img1);

    this.p1Effect = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uScale: { value: 1 },
        uDistortion: { value: this.brush },
      },
      vertexShader: p1VertexShader,
      fragmentShader: p1FragmentShader,
    };
    this.p1Pass = new ShaderPass(this.p1Effect);
    this.p1Pass.renderToScreen = true;
    this.composer.addPass(this.p1Pass);
    // this.bloomPaass = new UnrealBloomPass();
    // this.composer.addPass(this.bloomPaass);

    const postFolder = this.pane.addFolder({ title: "post" });
    postFolder.addInput(this.p1Pass.uniforms.uProgress, "value", {
      min: 0,
      max: 1,
      step: 0.0001,
      label: "uProgress",
    });
    postFolder.addInput(this.p1Pass.uniforms.uScale, "value", {
      min: 0,
      max: 10,
      step: 0.01,
      label: "uScale",
    });
  }
  render() {
    this.time += 0.01;
    this.meshes.forEach((m) => {
      //   m.position.y = -this.p1Pass.uniforms.uProgress.value;
      m.rotation.z = (this.p1Pass.uniforms.uProgress.value * Math.PI) / 2;
    });
    this.p1Pass.uniforms.uTime.value = this.time;
    this.composer.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById("container") });
