"use client"

import React, { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CustomNode = Node<{ label: string; type: 'company' | 'department' }>

const initialNodes: CustomNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'شرکت', type: 'company' },
    position: { x: 250, y: 0 },
  },
]

const initialEdges: Edge[] = []

const CompanyNode: React.FC<{ data: { label: string; type: 'company' | 'department' } }> = ({ data }) => {
  return (
    <Card className="w-40">
      <CardHeader className="p-4">
        <CardTitle className="text-center text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 text-center text-xs">
        {data.type === 'company' ? 'شرکت' : 'دپارتمان'}
      </CardContent>
    </Card>
  )
}

const nodeTypes = {
  company: CompanyNode,
  department: CompanyNode,
}

export default function CompanyDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [newDepartment, setNewDepartment] = useState('')

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addDepartment = () => {
    if (newDepartment) {
      const newNode: CustomNode = {
        id: (nodes.length + 1).toString(),
        type: 'default',
        data: { label: newDepartment, type: 'department' },
        position: { x: Math.random() * 500, y: Math.random() * 300 + 100 },
      }
      setNodes((nds) => nds.concat(newNode))
      setNewDepartment('')

      // Add an edge from the company to the new department
      const newEdge: Edge = {
        id: `e1-${newNode.id}`,
        source: '1',
        target: newNode.id,
      }
      setEdges((eds) => eds.concat(newEdge))
    }
  }

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Input
          type="text"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          placeholder="نام دپارتمان جدید"
          className="w-48"
        />
        <Button onClick={addDepartment}>افزودن دپارتمان</Button>
      </div>
    </div>
  )
}