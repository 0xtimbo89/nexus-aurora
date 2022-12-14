/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Jiaxing (https://sketchfab.com/saitoyang)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/kirby-fd2774047b0f4be49540a1ebd5cf709d
title: Kirby
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/kirby.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={1}>
          <mesh
            geometry={nodes.pSphere7_face_0.geometry}
            material={materials.face}
          />
          <mesh
            geometry={nodes.pSphere7_face2_0.geometry}
            material={materials.face2}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/kirby.glb");
