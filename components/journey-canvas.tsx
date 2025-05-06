"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Plus, Minus, Maximize, Sparkles, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface JourneyNode {
  id: string
  type: "entrance" | "wait" | "push" | "email" | "branch" | "exit"
  position?: { x: number; y: number }
  content?: {
    title?: string
    description?: string
    segments?: string[]
    excludedSegments?: string[]
    waitDuration?: string
    exitConditions?: string[]
    trigger?: string
    start?: string
  }
  connections?: string[]
  branches?: {
    yes?: string[]
    no?: string[]
  }
  messageContent?: {
    title?: string
    body?: string
    subject?: string // For email nodes
  }
  reasoning?: string // Added reasoning field
}

interface JourneyCanvasProps {
  nodes: JourneyNode[]
  onNodesChange?: (nodes: JourneyNode[]) => void
  useUserBehavior?: boolean // Added prop to indicate if user behavior is enabled
}

export function JourneyCanvas({ nodes: initialNodes, onNodesChange, useUserBehavior = false }: JourneyCanvasProps) {
  const [nodes, setNodes] = useState<JourneyNode[]>(initialNodes || [])
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [showOptimizationPanel, setShowOptimizationPanel] = useState(false)
  const [optimizationType, setOptimizationType] = useState<"timing" | "sequence" | "branching" | null>(null)
  const [showInsightsPanel, setShowInsightsPanel] = useState(false)

  // Organize nodes in a vertical layout
  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      // Create a map of node connections
      const connectionMap = new Map<string, string[]>()
      const branchMap = new Map<string, { yes: string[]; no: string[] }>()

      initialNodes.forEach((node) => {
        if (node.connections) {
          connectionMap.set(node.id, node.connections)
        }
        if (node.branches) {
          branchMap.set(node.id, {
            yes: node.branches.yes || [],
            no: node.branches.no || [],
          })
        }
      })

      // Find the root node (entrance)
      const rootNode = initialNodes.find((node) => node.type === "entrance") || initialNodes[0]

      // Organize nodes in a tree structure
      const organizedNodes = organizeNodes(rootNode, connectionMap, branchMap)

      setNodes(organizedNodes)
    }
  }, [initialNodes])

  // Function to organize nodes in a tree structure
  const organizeNodes = (
    rootNode: JourneyNode,
    connectionMap: Map<string, string[]>,
    branchMap: Map<string, { yes: string[]; no: string[] }>,
  ): JourneyNode[] => {
    const centerX = 550 // Center position for nodes
    const verticalSpacing = 220 // Increase vertical spacing between nodes (was 180)
    const horizontalSpacing = 300 // Horizontal spacing for branches

    const organizedNodes: JourneyNode[] = []
    const processedNodeIds = new Set<string>()

    // Process a node and its children
    const processNode = (node: JourneyNode, level: number, horizontalOffset = 0) => {
      if (processedNodeIds.has(node.id)) return

      processedNodeIds.add(node.id)

      // Position the node
      const positionedNode = {
        ...node,
        position: {
          x: centerX + horizontalOffset,
          y: level * verticalSpacing,
        },
      }

      organizedNodes.push(positionedNode)

      // Process branch nodes
      if (node.type === "branch" && branchMap.has(node.id)) {
        const branches = branchMap.get(node.id)!

        // Process "yes" branch
        if (branches.yes && branches.yes.length > 0) {
          const yesNodeId = branches.yes[0]
          const yesNode = initialNodes.find((n) => n.id === yesNodeId)
          if (yesNode) {
            processNode(yesNode, level + 1, -horizontalSpacing)
          }
        }

        // Process "no" branch
        if (branches.no && branches.no.length > 0) {
          const noNodeId = branches.no[0]
          const noNode = initialNodes.find((n) => n.id === noNodeId)
          if (noNode) {
            processNode(noNode, level + 1, horizontalSpacing)
          }
        }

        return
      }

      // Process regular connections
      const connections = connectionMap.get(node.id) || []
      connections.forEach((connectionId) => {
        const connectedNode = initialNodes.find((n) => n.id === connectionId)
        if (connectedNode) {
          processNode(connectedNode, level + 1, horizontalOffset)
        }
      })
    }

    // Start processing from the root node
    processNode(rootNode, 0)

    return organizedNodes
  }

  // Update canvas size on resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleZoomReset = () => {
    setZoom(1)
  }

  // AI optimization functions
  const handleOptimizeTiming = () => {
    setOptimizationType("timing")
    setShowOptimizationPanel(true)
  }

  const handleOptimizeSequence = () => {
    setOptimizationType("sequence")
    setShowOptimizationPanel(true)
  }

  const handleSuggestBranching = () => {
    setOptimizationType("branching")
    setShowOptimizationPanel(true)
  }

  const handleToggleInsights = () => {
    setShowInsightsPanel(!showInsightsPanel)
  }

  const handleApplyChanges = (updatedNodes: JourneyNode[]) => {
    // Example optimization: adjust wait times between messages
    if (optimizationType === "timing") {
      const optimizedNodes = nodes.map((node) => {
        if (node.type === "wait") {
          return {
            ...node,
            content: {
              ...node.content,
              waitDuration: "2 Days", // Optimized wait duration
            },
          }
        }
        return node
      })

      setNodes(optimizedNodes)
      if (onNodesChange) {
        onNodesChange(optimizedNodes)
      }
    }

    setShowOptimizationPanel(false)
  }

  // Render node based on type
  const renderNode = (node: JourneyNode) => {
    const nodeStyle = {
      left: `${node.position?.x || 0}px`,
      top: `${node.position?.y || 0}px`,
      transform: "translateX(-50%)", // Center horizontally
    }

    // Add info button if reasoning exists and user behavior is enabled
    const renderInfoButton = () => {
      if (useUserBehavior && node.reasoning) {
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1 text-blue-500"
            onClick={() => {
              // Show reasoning in a tooltip or modal
              alert(node.reasoning)
            }}
          >
            <Info className="h-4 w-4" />
          </Button>
        )
      }
      return null
    }

    switch (node.type) {
      case "entrance":
        return (
          <div
            className="absolute bg-white rounded-lg shadow-sm border border-gray-200 w-[300px] min-h-[120px]"
            style={nodeStyle}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded flex items-center justify-center mr-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Entrance</h3>
                {renderInfoButton()}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm">
                <div className="mb-2">
                  <span className="font-medium">Trigger: </span>
                  <span>{node.content?.trigger || "Audience Segment"}</span>
                </div>
                <div>
                  <span className="font-medium">Start: </span>
                  <span>{node.content?.start || "Immediately"}</span>
                </div>
              </div>
            </div>
          </div>
        )

      // Update other node types similarly with min-height
      case "wait":
        return (
          <div
            className="absolute bg-white rounded-lg shadow-sm border border-gray-200 w-[300px] min-h-[120px]"
            style={nodeStyle}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-5 h-5 bg-amber-500 rounded flex items-center justify-center mr-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" />
                    <path
                      d="M8 5V8L10 10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Wait</h3>
                {renderInfoButton()}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm font-medium">{node.content?.waitDuration || node.waitDuration || "3 Days"}</p>
            </div>
          </div>
        )

      case "push":
        return (
          <div
            className="absolute bg-white rounded-lg shadow-sm border border-gray-200 w-[300px] min-h-[120px]"
            style={nodeStyle}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded flex items-center justify-center mr-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3333 5.33333C13.3333 4.22876 12.4379 3.33333 11.3333 3.33333H4.66667C3.5621 3.33333 2.66667 4.22876 2.66667 5.33333V10.6667C2.66667 11.7712 3.5621 12.6667 4.66667 12.6667H11.3333C12.4379 12.6667 13.3333 11.7712 13.3333 10.6667V5.33333Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33333 6.66667L8 9.33333L10.6667 6.66667"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Push Notification</h3>
                {renderInfoButton()}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              {node.messageContent?.title ? (
                <div className="text-sm">
                  <p className="font-medium text-blue-600 mb-1">{node.messageContent.title}</p>
                  {node.messageContent.body && <p className="text-gray-600">{node.messageContent.body}</p>}
                </div>
              ) : (
                <p className="text-sm text-gray-500">There is still work to do</p>
              )}
            </div>
          </div>
        )

      case "email":
        return (
          <div
            className="absolute bg-white rounded-lg shadow-sm border border-gray-200 w-[300px] min-h-[120px]"
            style={nodeStyle}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded flex items-center justify-center mr-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="12" height="8" rx="1" stroke="white" strokeWidth="1.5" />
                    <path
                      d="M2 5L8 9L14 5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Email</h3>
                {renderInfoButton()}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              {node.messageContent?.subject ? (
                <div className="text-sm">
                  <p className="font-medium text-blue-600 mb-1">Subject: {node.messageContent.subject}</p>
                  {node.messageContent.title && <p className="font-medium mb-1">{node.messageContent.title}</p>}
                  {node.messageContent.body && <p className="text-gray-600">{node.messageContent.body}</p>}
                </div>
              ) : (
                <p className="text-sm text-gray-500">There is still work to do</p>
              )}
            </div>
          </div>
        )

      case "branch":
        return (
          <div
            className="absolute bg-white rounded-lg shadow-sm border border-gray-200 w-[300px] min-h-[120px]"
            style={nodeStyle}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded flex items-center justify-center mr-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 2V14M8 2L4 6M8 2L12 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Yes/No Branch</h3>
                {renderInfoButton()}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">There is still work to do</p>
            </div>
          </div>
        )

      case "exit":
        return (
          <div
            className="absolute bg-white rounded-lg shadow-sm border border-gray-200 w-[300px] min-h-[120px]"
            style={nodeStyle}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded flex items-center justify-center mr-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.6667 5.33333L13.3333 8M13.3333 8L10.6667 10.6667M13.3333 8H6.66667M9.33333 2.66667C8.27777 2 7.02222 2 5.33333 2C3.16667 2 2.08333 2 1.41667 2.66667C0.75 3.33333 0.75 4.41667 0.75 6.58333V9.41667C0.75 11.5833 0.75 12.6667 1.41667 13.3333C2.08333 14 3.16667 14 5.33333 14C7.02222 14 8.27777 14 9.33333 13.3333"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Exit</h3>
                {renderInfoButton()}
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm">
                <p className="font-medium mb-2">Exit Rules</p>
                <p className="mb-1">
                  User has received all messages <span className="text-gray-500">or</span>
                </p>
                <p className="mb-1">
                  User becomes active <span className="text-gray-500">or</span>
                </p>
                <p className="mb-1">User no longer matches audience conditions</p>

                <p className="font-medium mt-3 mb-2">Re-Entry Rules</p>
                <p className="mb-1">Users can only enter the Journey once</p>

                <p className="font-medium mt-3 mb-2">Stop:</p>
                <p>Never</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderConnections = () => {
    // Find branch nodes
    const branchNodes = nodes.filter((node) => node.type === "branch")

    // Render regular connections
    const regularConnections = nodes.map((node, index) => {
      // Skip branch nodes, they'll be handled separately
      if (node.type === "branch") return null

      // Find the next node that this node connects to
      const nextNode = nodes.find(
        (n) => n.id === (node.connections && node.connections.length > 0 ? node.connections[0] : null),
      )

      if (!nextNode) return null

      const startX = node.position?.x || 0
      const startY = (node.position?.y || 0) + 100 // Increase bottom offset (was 80)
      const endX = nextNode.position?.x || 0
      const endY = nextNode.position?.y || 0 // Top of next node

      // Calculate midpoint for the plus button
      const midY = startY + (endY - startY) / 2

      return (
        <div key={`connection-${node.id}-${nextNode.id}`}>
          {/* Vertical line */}
          <div
            className="absolute bg-gray-300 w-[1px]"
            style={{
              left: `${startX}px`,
              top: `${startY}px`,
              height: `${endY - startY}px`,
              transform: "translateX(-50%)", // Center the line
            }}
          />

          {/* Plus button at midpoint */}
          <div
            className="absolute bg-white rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm"
            style={{
              left: `${startX}px`,
              top: `${midY}px`,
              transform: "translate(-50%, -50%)", // Center the button
              zIndex: 2,
            }}
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      )
    })

    // Render branch connections
    const branchConnections = branchNodes.flatMap((branchNode) => {
      if (!branchNode.branches || (!branchNode.branches.yes && !branchNode.branches.no)) return []

      const connections = []
      const startX = branchNode.position?.x || 0
      const startY = (branchNode.position?.y || 0) + 100 // Increase bottom offset (was 80)

      // Yes branch
      if (branchNode.branches.yes && branchNode.branches.yes.length > 0) {
        const yesNodeId = branchNode.branches.yes[0]
        const yesNode = nodes.find((n) => n.id === yesNodeId)

        if (yesNode) {
          const endX = yesNode.position?.x || 0
          const endY = yesNode.position?.y || 0 // Top of yes node

          // Calculate midpoint for the plus button
          const midX = startX + (endX - startX) / 2
          const midY = startY + 20 // Position on the horizontal part of the path

          connections.push(
            <div key={`branch-yes-${branchNode.id}-${yesNodeId}`}>
              {/* Path from branch to yes node */}
              <svg
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <path
                  d={`M${startX},${startY} L${startX},${startY + 20} L${endX},${startY + 20} L${endX},${endY}`}
                  stroke="#D1D5DB"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>

              {/* Plus button at midpoint */}
              <div
                className="absolute bg-white rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm"
                style={{
                  left: `${midX}px`,
                  top: `${midY}px`,
                  transform: "translate(-50%, -50%)", // Center the button
                  zIndex: 2,
                }}
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </div>
            </div>,
          )
        }
      }

      // No branch
      if (branchNode.branches.no && branchNode.branches.no.length > 0) {
        const noNodeId = branchNode.branches.no[0]
        const noNode = nodes.find((n) => n.id === noNodeId)

        if (noNode) {
          const endX = noNode.position?.x || 0
          const endY = noNode.position?.y || 0 // Top of no node

          // Calculate midpoint for the plus button
          const midX = startX + (endX - startX) / 2
          const midY = startY + 20 // Position on the horizontal part of the path

          connections.push(
            <div key={`branch-no-${branchNode.id}-${noNodeId}`}>
              {/* Path from branch to no node */}
              <svg
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <path
                  d={`M${startX},${startY} L${startX},${startY + 20} L${endX},${startY + 20} L${endX},${endY}`}
                  stroke="#D1D5DB"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>

              {/* Plus button at midpoint */}
              <div
                className="absolute bg-white rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm"
                style={{
                  left: `${midX}px`,
                  top: `${midY}px`,
                  transform: "translate(-50%, -50%)", // Center the button
                  zIndex: 2,
                }}
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </div>
            </div>,
          )
        }
      }

      return connections
    })

    return [...regularConnections, ...branchConnections]
  }

  // Render optimization panel
  const renderOptimizationPanel = () => {
    if (!showOptimizationPanel) return null

    let title = "Journey Optimization"
    let description = "Optimize your journey for better performance."
    let recommendations = []

    switch (optimizationType) {
      case "timing":
        title = "Timing Optimization"
        description = "Optimize wait times between messages for better engagement."
        recommendations = [
          {
            suggestion: "Reduce wait time between first and second message to 2 days",
            reasoning:
              "Based on user behavior data, 73% of your users who convert do so within 48 hours of the first message.",
          },
          {
            suggestion: "Increase wait time before exit to 5 days",
            reasoning:
              "Analysis shows users who don't engage within 5 days are unlikely to convert (less than 3% conversion rate).",
          },
          {
            suggestion: "Send push notifications in the morning (8-10 AM)",
            reasoning: "Your audience shows 42% higher open rates during morning hours compared to afternoon sends.",
          },
        ]
        break
      case "sequence":
        title = "Sequence Optimization"
        description = "Optimize the sequence of messages for better conversion."
        recommendations = [
          {
            suggestion: "Move email before push notification",
            reasoning:
              "Users who receive an email first show 27% higher engagement with subsequent push notifications.",
          },
          {
            suggestion: "Add a reminder message 24 hours before expiration",
            reasoning: "Last-minute reminders have increased conversion by 35% in similar journeys.",
          },
          {
            suggestion: "Add social proof content to the second message",
            reasoning: "Based on your audience segment behavior, testimonials increase conversion rates by 22%.",
          },
        ]
        break
      case "branching":
        title = "Branching Suggestions"
        description = "Add conditional branches to personalize the journey."
        recommendations = [
          {
            suggestion: "Add a branch based on user's engagement with previous message",
            reasoning:
              "Users who opened but didn't click through need different messaging (67% respond better to benefit-focused content).",
          },
          {
            suggestion: "Create a special path for high-value customers",
            reasoning:
              "Your top 20% of customers have different engagement patterns and respond 3x better to exclusive offers.",
          },
          {
            suggestion: "Add a re-engagement branch for users who haven't opened messages",
            reasoning:
              "Historical data shows 18% of non-responders can be recovered with a different channel or subject line.",
          },
        ]
        break
    }

    return (
      <div className="fixed bottom-4 right-4 w-80 z-10">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{title}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowOptimizationPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="font-medium text-sm">Recommendations:</p>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <p className="ml-2 font-medium text-sm">{rec.suggestion}</p>
                    </div>
                    <div className="ml-7 text-xs text-gray-600 border-l-2 border-gray-200 pl-2">{rec.reasoning}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" size="sm" onClick={() => setShowOptimizationPanel(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleApplyChanges(nodes)}>
                  Apply Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render insights panel
  const renderInsightsPanel = () => {
    if (!showInsightsPanel || !useUserBehavior) return null

    return (
      <div className="fixed top-20 right-4 w-80 z-10">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Journey Insights</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowInsightsPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Based on user behavior patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="ml-2 font-medium text-sm">Optimal journey length</p>
                  </div>
                  <div className="ml-7 text-xs text-gray-600 border-l-2 border-gray-200 pl-2">
                    Your users typically engage with 3-4 messages before conversion or drop-off.
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="ml-2 font-medium text-sm">Best performing channel</p>
                  </div>
                  <div className="ml-7 text-xs text-gray-600 border-l-2 border-gray-200 pl-2">
                    Push notifications have 38% higher engagement than emails for this audience segment.
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="ml-2 font-medium text-sm">Optimal timing</p>
                  </div>
                  <div className="ml-7 text-xs text-gray-600 border-l-2 border-gray-200 pl-2">
                    Morning sends (8-10 AM) perform 42% better than afternoon or evening sends.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full overflow-auto"
      style={{
        backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Canvas Header */}
      <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <h2 className="text-lg font-medium">Journey Canvas</h2>
        <div className="flex items-center gap-2">
          {useUserBehavior && (
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              onClick={handleToggleInsights}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Behaviours used to build this Journey</span>
            </button>
          )}
        </div>
      </div>

      <div
        ref={canvasRef}
        className="relative min-h-[1500px]"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {renderConnections()}
        {nodes.map((node) => (
          <div key={node.id} className="absolute">
            {renderNode(node)}
          </div>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex flex-col bg-white rounded-md shadow-md">
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
          <Minus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomReset} className="h-8 w-8">
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Optimization Panel */}
      {renderOptimizationPanel()}

      {/* Insights Panel */}
      {renderInsightsPanel()}
    </div>
  )
}
