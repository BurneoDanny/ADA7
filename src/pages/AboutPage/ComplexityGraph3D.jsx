import React, { useEffect, useRef } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ComplexityGraph3D() {
  const graphRef = useRef(null);

  useEffect(() => {
    if (!graphRef.current) return;

    const width = graphRef.current.clientWidth;
    const height = graphRef.current.clientHeight;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x0a0a1a);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(3.5, 3.5, 4.5);
    camera.lookAt(new THREE.Vector3(2, 2, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    while (graphRef.current.firstChild) {
      graphRef.current.removeChild(graphRef.current.firstChild);
    }
    graphRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Efecto de inercia
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.update();

    const ambientLight = new THREE.AmbientLight(0x404040, 5);
    scene.add(ambientLight);

    const axisColor = 0x00ffff; // Cian
    const axisMaterial = new THREE.LineBasicMaterial({
      color: axisColor,
      linewidth: 2,
    });

    const size = 4.5;

    const pointsX = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(size, 0, 0)];
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pointsX),
        axisMaterial
      )
    );

    const pointsY = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, size, 0)];
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pointsY),
        axisMaterial
      )
    );

    const linePointsN = [];
    for (let i = 0; i <= size; i += 0.5) {
      linePointsN.push(new THREE.Vector3(i, i, 0));
    }

    const geometryN = new THREE.BufferGeometry().setFromPoints(linePointsN);
    const lineMaterialN = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 7,
    });
    const complexityLineN = new THREE.Line(geometryN, lineMaterialN);
    scene.add(complexityLineN);

    const linePointsN2 = [];
    for (let i = 0; i <= 2; i += 0.2) {
      linePointsN2.push(new THREE.Vector3(i, i * i, 0));
    }

    const geometryN2 = new THREE.BufferGeometry().setFromPoints(linePointsN2);
    const lineMaterialN2 = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      linewidth: 3,
    });
    const complexityLineN2 = new THREE.Line(geometryN2, lineMaterialN2);
    scene.add(complexityLineN2);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (graphRef.current) {
        const newWidth = graphRef.current.clientWidth;
        const newHeight = graphRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
      if (graphRef.current) {
        while (graphRef.current.firstChild) {
          graphRef.current.removeChild(graphRef.current.firstChild);
        }
      }
    };
  }, []);

  return (
    <div
      ref={graphRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        cursor: "grab",
      }}
    />
  );
}
