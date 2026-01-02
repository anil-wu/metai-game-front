"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Transformer, Circle } from 'react-konva';
import { ToolType } from './types/ToolType';
import Konva from 'konva';
import { 
  BaseElement as BaseElementModel, 
  DrawElement as DrawElementModel
} from './types/BaseElement';

import { useWorkspaceStore } from '@/store/useWorkspaceStore';

import { ToolFactory } from './editor/tools/ToolFactory';
import { IMouseAction, ToolContext } from './editor/tools/interfaces/Tool';
import { getElementComponent } from './editor/tools/ElementRegistry';


interface EditorStageProps {
  activeTool: ToolType;
  onToolUsed: () => void;
  zoom: number;
  stagePos?: { x: number, y: number };
  onStagePosChange?: (pos: { x: number, y: number }) => void;
  width: number;
  height: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onToolChange?: (tool: ToolType) => void;
  drawingStyle?: { stroke: string; strokeWidth: number };
}

export default function EditorStage({
  activeTool,
  onToolUsed,
  zoom,
  stagePos = { x: 0, y: 0 },
  onStagePosChange,
  width,
  height,
  onDragStart,
  onDragEnd,
  onToolChange,
  drawingStyle,
}: EditorStageProps) {
  const { elements, selectedId, setElements, selectElement, addElement, updateElement } = useWorkspaceStore();
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPos, setDrawStartPos] = useState({ x: 0, y: 0 });
  const [previewElement, setPreviewElement] = useState<BaseElementModel | null>(null);
  const [isClosingPath, setIsClosingPath] = useState(false);

  // Tool Instance Management
  const toolInstanceRef = useRef<IMouseAction | null>(null);

  useEffect(() => {
    toolInstanceRef.current = ToolFactory.createTool(activeTool);
  }, [activeTool]);

  const getToolContext = (): ToolContext => ({
    setPreviewElement,
    previewElement,
    setIsDrawing,
    isDrawing,
    setIsClosingPath,
    drawingStyle,
    onToolUsed,
    onToolChange,
    stagePos,
    setStagePos: onStagePosChange
  });

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    toolInstanceRef.current?.onMouseDown(e, getToolContext());
  };

  const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    toolInstanceRef.current?.onMouseMove(e, getToolContext());
  };

  const onMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    toolInstanceRef.current?.onMouseUp(e, getToolContext());
  };

  const onDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    toolInstanceRef.current?.onDblClick(e, getToolContext());
  };

  // Handle stage position updates (centering)
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.position(stagePos);
      stageRef.current.batchDraw();
    }
  }, [stagePos]);

  // Update cursor based on tool
  useEffect(() => {
    if (stageRef.current) {
      if (activeTool === 'hand') {
        stageRef.current.container().style.cursor = 'grab';
      } else {
        stageRef.current.container().style.cursor = 'default';
      }
    }
  }, [activeTool]);

  // Handle selection transformer
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current && !isDrawing) {
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, elements, isDrawing]);









  const handleElementChange = (id: string, newAttrs: any) => {
    updateElement(id, newAttrs);
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      scaleX={zoom}
      scaleY={zoom}
      x={stagePos.x}
      y={stagePos.y}
      draggable={false}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown as any}
      onMouseMove={onMouseMove}
      onTouchMove={onMouseMove as any}
      onMouseUp={onMouseUp}
      onTouchEnd={onMouseUp as any}
      onDblClick={onDblClick}
      className="bg-[#fafafa]"
    >
      <Layer>
        {[...elements, ...(previewElement ? [previewElement] : [])].map((el) => {
          if (!el.visible) return null;
          
          const ElementComponent = getElementComponent(el.type);
          if (!ElementComponent) return null;

          const isSelected = selectedId === el.id || (el.type === 'pen' && el.id === previewElement?.id);
          
          return (
            <ElementComponent
              key={el.id}
              {...el.toState()}
              isSelected={isSelected}
              isEditing={el.isEditing}
            />
          );
        })}
        <Transformer

          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
        
        {/* Draw start point indicator for closing path */}
        {isClosingPath && activeTool === 'pen' && isDrawing && previewElement && (
           <Circle 
             x={(previewElement as DrawElementModel).points?.[0] || 0}
             y={(previewElement as DrawElementModel).points?.[1] || 0}
             radius={8}
             stroke="#3b82f6"
             strokeWidth={2}
             fill="transparent"
           />
        )}
      </Layer>
    </Stage>
  );
}
