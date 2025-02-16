import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// import * as mcpServer from '../../services/mcp';
import { Html } from '@react-three/drei'

// export function Box(props: ThreeElements['mesh']) {
export function Box(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
        </mesh>
    )
}

export default function Scene() {
    
    const gltf = useLoader(GLTFLoader, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/Avocado/glTF/Avocado.gltf')

    // const [mcpClient, setMcpClient] = useState<any | null>(null);
    // const [prompts, setPrompts] = useState([]);

    // useEffect(() => {
    //     async function startClient() {
    //         const client = await mcpServer.startClient();
    //         console.log("client:", client);
    //         setMcpClient(client);
    //     }

    //     startClient();
    // }, [])

    // useEffect(() => {
    //     if (mcpClient) {
    //         async function listPrompts() {
    //             const prompts = await mcpClient.listPrompts();
    //             console.log("client prompts:", prompts);
    //             setPrompts(prompts);
    //         }

        
    //         listPrompts();
    //     }
    // }, [mcpClient])

    

    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
            <primitive 
                object={gltf.scene} 
                position={[1.2, 0, 0]} 
                scale={[100, 100, 100]}
            />
            {/* <Html center>
                <div style={{ color: 'white' }}>
                    <h1>MCP</h1>
                    <p>MCP server is {mcpClient ? 
                        <p style={{ color: 'green' }}> 'connected' </p> :
                        <p style={{ color: 'red' }}> 'not connected' </p>
                    }</p>
                    <p>List of prompts:</p>
                    <ul>
                        {prompts.map((prompt, index) => (
                            <li key={index}>{prompt}</li>
                        ))}
                    </ul>
                </div>
            </Html> */}
        </Canvas>
    )
}
