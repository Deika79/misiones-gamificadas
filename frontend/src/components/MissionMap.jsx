import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls,
  ReactFlowProvider
} from "reactflow";

import { useParams } from "react-router-dom";

import "reactflow/dist/style.css";
import { useAxios } from "../api/axiosInstance";

import MapNode from "./MapNode";
import NodeEditor from "./NodeEditor";

const nodeTypes = {
  mapNode: MapNode
};

// =========================
// COMPONENTE INTERNO
// =========================
function MissionMapInner() {

  const axios = useAxios(); // ✅ HOOK BIEN COLOCADO

  const { missionId } = useParams();
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const lastSaved = useRef({
    nodes: [],
    edges: []
  });

  const saveTimeout = useRef(null);

  // =========================
  // CARGAR MAPA
  // =========================

  useEffect(() => {

    const loadNodes = async () => {
      try {
        const res = await axios.get(`/nodes/${missionId}`);

        const formattedNodes = res.data.map(node => ({
          id: node._id,
          type: "mapNode",
          position: node.position,
          data: {
            label: node.title,
            type: node.type || "city",
            description: node.description || ""
          }
        }));

        const formattedEdges = [];

        res.data.forEach(node => {
          node.connections?.forEach(target => {
            formattedEdges.push({
              id: `${node._id}-${target}`,
              source: node._id,
              target: target,
              type: "smoothstep",
              style: {
                stroke: "#000",
                strokeWidth: 3
              }
            });
          });
        });

        setNodes(formattedNodes);
        setEdges(formattedEdges);

        lastSaved.current = {
          nodes: formattedNodes,
          edges: formattedEdges
        };

      } catch (error) {
        console.error("Error cargando nodos:", error);
      }
    };

    if (missionId) {
      loadNodes();
    }

  }, [missionId]);

  // =========================
  // AUTOSAVE
  // =========================

  useEffect(() => {

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {

      const current = JSON.stringify({ nodes, edges });
      const previous = JSON.stringify(lastSaved.current);

      if (current !== previous) {
        try {
          await axios.put(`/missions/${missionId}`, {
            nodes,
            edges
          });

          lastSaved.current = { nodes, edges };

          console.log("Mapa guardado automáticamente");

        } catch (error) {
          console.error("Error guardando mapa:", error);
        }
      }

    }, 2000);

  }, [nodes, edges, missionId]);

  // =========================
  // CREAR NODO
  // =========================

  const onPaneClick = useCallback(async (event) => {

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });

    const title = prompt("Nombre del nodo:", "Nuevo Nodo");
    if (!title) return;

    const type = prompt(
      "Tipo de nodo: city, castle, dungeon, forest, mountain",
      "city"
    );

    try {
      const res = await axios.post("/nodes", {
        missionId,
        title,
        type,
        position
      });

      const newNode = {
        id: res.data._id,
        type: "mapNode",
        position: res.data.position,
        data: {
          label: res.data.title,
          type: res.data.type || "city"
        }
      };

      setNodes((nds) => [...nds, newNode]);

    } catch (error) {
      console.error("Error creando nodo:", error);
    }

  }, [screenToFlowPosition, missionId]);

  // =========================
  // CLICK NODO
  // =========================

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  // =========================
  // DRAG NODO
  // =========================

  const onNodeDragStop = async (event, node) => {
    try {
      await axios.put(`/nodes/${node.id}`, {
        position: node.position
      });
    } catch (error) {
      console.error("Error moviendo nodo:", error);
    }
  };

  // =========================
  // CONECTAR NODOS
  // =========================

  const onConnect = useCallback(async (params) => {

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "smoothstep",
          style: {
            stroke: "#000",
            strokeWidth: 3
          }
        },
        eds
      )
    );

    try {
      await axios.post("/nodes/connect", {
        source: params.source,
        target: params.target
      });
    } catch (error) {
      console.error("Error conectando nodos:", error);
    }

  }, []);

  // =========================
  // RENDER
  // =========================

  return (
    <div style={{ display: "flex", height: "600px" }}>

      <div
        style={{
          flex: 3,
          backgroundImage: "url('/maps/map1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>

      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ccc",
          background: "#f9f9f9"
        }}
      >
        <NodeEditor
          node={selectedNode}
          onUpdate={(updatedNode) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === updatedNode._id
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        label: updatedNode.title,
                        type: updatedNode.type,
                        description: updatedNode.description
                      }
                    }
                  : n
              )
            );
          }}
          onDelete={(nodeId) => {
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));

            setEdges((eds) =>
              eds.filter(
                (e) =>
                  e.source !== nodeId &&
                  e.target !== nodeId
              )
            );

            setSelectedNode(null);
          }}
        />
      </div>
    </div>
  );
}

// =========================
// EXPORT FINAL
// =========================

export default function MissionMap() {
  return (
    <ReactFlowProvider>
      <MissionMapInner />
    </ReactFlowProvider>
  );
}