import React from 'react';
import { Rect, Ellipse, RegularPolygon, Star as KonvaStar, Path } from 'react-konva';
import { BaseElement, BaseElementProps } from './BaseElement';
import { ToolType } from '../ToolsPanel';

interface ShapeElementProps extends BaseElementProps {
  type: ToolType;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  cornerRadius?: number;
  sides?: number;
  starInnerRadius?: number;
}

export default function ShapeElement(props: ShapeElementProps) {
  const { type, width, height, color = '#3b82f6', stroke, strokeWidth, strokeStyle, cornerRadius, sides, starInnerRadius, children } = props;

  const getDash = () => {
    switch (strokeStyle) {
      case 'dashed': return [10, 5];
      case 'dotted': return [2, 2];
      default: return undefined;
    }
  };

  const commonShapeProps = {
    fill: color,
    stroke: stroke,
    strokeWidth: strokeWidth,
    dash: getDash(),
  };

  const renderShape = () => {
    switch (type) {
      case 'rectangle':
        return (
          <Rect
            width={width}
            height={height}
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            dash={getDash()}
            cornerRadius={cornerRadius || 0}
          />
        );
      case 'circle':
        // Konva Circle uses radius, but our model uses width/height
        // We use Ellipse to support non-uniform scaling
        return (
          <Ellipse
            x={width / 2}
            y={height / 2}
            radiusX={width / 2}
            radiusY={height / 2}
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            dash={getDash()}
          />
        );
      case 'triangle': {
        // Use Path to create regular polygon with rounded corners (Triangle is just 3 sides)
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;
        const numSides = Math.max(3, sides || 3);
        
        // Calculate polygon points
        const polygonPoints = [];
        for (let i = 0; i < numSides; i++) {
          const angle = (i * 2 * Math.PI / numSides) - Math.PI / 2; // Start from top
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          polygonPoints.push({ x, y });
        }
        
        // Create path with rounded corners
        let polygonPathData;
        if (cornerRadius > 0) {
          // Create rounded polygon path using arcs
          const pathCommands = [];
          
          for (let i = 0; i < numSides; i++) {
            const current = polygonPoints[i];
            const next = polygonPoints[(i + 1) % numSides];
            const prev = polygonPoints[(i + numSides - 1) % numSides];
            
            // 1. Calculate vectors from Current to Prev and Current to Next
            const vecToPrev = { x: prev.x - current.x, y: prev.y - current.y };
            const vecToNext = { x: next.x - current.x, y: next.y - current.y };
            
            const distToPrev = Math.sqrt(vecToPrev.x ** 2 + vecToPrev.y ** 2);
            const distToNext = Math.sqrt(vecToNext.x ** 2 + vecToNext.y ** 2);
            
            // Normalize vectors
            const dirToPrev = { x: vecToPrev.x / distToPrev, y: vecToPrev.y / distToPrev };
            const dirToNext = { x: vecToNext.x / distToNext, y: vecToNext.y / distToNext };
            
            // 2. Calculate angle between vectors
            // Dot product: a . b = |a||b|cos(theta) -> cos(theta) = a . b (since normalized)
            const dotProduct = dirToPrev.x * dirToNext.x + dirToPrev.y * dirToNext.y;
            // Clamp dot product to -1..1 to avoid numerical errors
            const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
            
            // 3. Calculate tangent distance based on corner radius
            // The distance from vertex to tangent point is r / tan(angle/2)
            const halfAngle = angle / 2;
            let tangentDist = cornerRadius / Math.tan(halfAngle);
            
            // 4. Clamp tangent distance to prevent overlap
            // Must not exceed half of the shortest adjacent side
            const maxDist = Math.min(distToPrev, distToNext) * 0.5;
            
            let effectiveRadius = cornerRadius;
            
            if (tangentDist > maxDist) {
               tangentDist = maxDist;
               // Recalculate radius to match the constrained distance
               // r = dist * tan(angle/2)
               effectiveRadius = tangentDist * Math.tan(halfAngle);
            }
            
            // 5. Calculate start and end points of the arc
            const startPoint = {
              x: current.x + dirToPrev.x * tangentDist,
              y: current.y + dirToPrev.y * tangentDist
            };
            
            const endPoint = {
              x: current.x + dirToNext.x * tangentDist,
              y: current.y + dirToNext.y * tangentDist
            };
            
            if (i === 0) {
              pathCommands.push(`M ${startPoint.x} ${startPoint.y}`);
            }
            
            // Add line to start of arc
            pathCommands.push(`L ${startPoint.x} ${startPoint.y}`);
            
            // Add arc (using Q quadratic bezier for simple rounded corner or A arc command)
            // Using A command: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            // For a regular polygon corner, we want a circular arc.
            // The sweep flag depends on winding order. Here we go clockwise (top -> right -> ...), so sweep flag 1.
            pathCommands.push(`A ${effectiveRadius} ${effectiveRadius} 0 0 1 ${endPoint.x} ${endPoint.y}`);
          }
          pathCommands.push('Z');
          polygonPathData = pathCommands.join(' ');
        } else {
          // Create sharp polygon path
          polygonPathData = `M ${polygonPoints[0].x} ${polygonPoints[0].y}`;
          for (let i = 1; i < numSides; i++) {
            polygonPathData += ` L ${polygonPoints[i].x} ${polygonPoints[i].y}`;
          }
          polygonPathData += ' Z';
        }
        
        return (
          <Path
            data={polygonPathData}
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            dash={getDash()}
          />
        );
      }
      case 'star': {
        // Use Path to create star with rounded corners
        const starCenterX = width / 2;
        const starCenterY = height / 2;
        const outerRadius = Math.min(width, height) / 2;
        // Use provided starInnerRadius (percentage 0-100) or default to 50
        const innerRadiusPercentage = starInnerRadius !== undefined ? starInnerRadius : 50;
        const innerRadius = outerRadius * (innerRadiusPercentage / 100);
        // Use provided sides or default to 5
        const numPoints = sides || 5;
        const totalVertices = numPoints * 2;
        
        // Calculate star points
        const starPoints = [];
        for (let i = 0; i < totalVertices; i++) {
          const angle = (i * Math.PI / numPoints) - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = starCenterX + radius * Math.cos(angle);
          const y = starCenterY + radius * Math.sin(angle);
          starPoints.push({ x, y });
        }
        
        // Create path with rounded corners
        let starPathData;
        if (cornerRadius > 0) {
          // Create rounded star path using arcs
          const pathCommands = [];
          
          for (let i = 0; i < totalVertices; i++) {
            const current = starPoints[i];
            const next = starPoints[(i + 1) % totalVertices];
            const prev = starPoints[(i + totalVertices - 1) % totalVertices];
            
            // 1. Calculate vectors from Current to Prev and Current to Next
            const vecToPrev = { x: prev.x - current.x, y: prev.y - current.y };
            const vecToNext = { x: next.x - current.x, y: next.y - current.y };
            
            const distToPrev = Math.sqrt(vecToPrev.x ** 2 + vecToPrev.y ** 2);
            const distToNext = Math.sqrt(vecToNext.x ** 2 + vecToNext.y ** 2);
            
            // Normalize vectors
            const dirToPrev = { x: vecToPrev.x / distToPrev, y: vecToPrev.y / distToPrev };
            const dirToNext = { x: vecToNext.x / distToNext, y: vecToNext.y / distToNext };
            
            // 2. Calculate angle between vectors
            // Dot product: a . b = |a||b|cos(theta) -> cos(theta) = a . b (since normalized)
            const dotProduct = dirToPrev.x * dirToNext.x + dirToPrev.y * dirToNext.y;
            // Clamp dot product to -1..1 to avoid numerical errors
            const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
            
            // 3. Calculate tangent distance based on corner radius
            // The distance from vertex to tangent point is r / tan(angle/2)
            const halfAngle = angle / 2;
            let tangentDist = cornerRadius / Math.tan(halfAngle);
            
            // 4. Clamp tangent distance to prevent overlap
            // Must not exceed half of the shortest adjacent side
            const maxDist = Math.min(distToPrev, distToNext) * 0.5;
            
            let effectiveRadius = cornerRadius;
            
            if (tangentDist > maxDist) {
               tangentDist = maxDist;
               // Recalculate radius to match the constrained distance
               // r = dist * tan(angle/2)
               effectiveRadius = tangentDist * Math.tan(halfAngle);
            }
            
            // 5. Calculate start and end points of the arc
            const startPoint = {
              x: current.x + dirToPrev.x * tangentDist,
              y: current.y + dirToPrev.y * tangentDist
            };
            
            const endPoint = {
              x: current.x + dirToNext.x * tangentDist,
              y: current.y + dirToNext.y * tangentDist
            };
            
            if (i === 0) {
              pathCommands.push(`M ${startPoint.x} ${startPoint.y}`);
            }
            
            // Add line to start of arc
            pathCommands.push(`L ${startPoint.x} ${startPoint.y}`);
            
            // Add arc
            // Sweep flag: 1 for clockwise, 0 for counter-clockwise
            // For outer corners (even indices), we go around the outside -> clockwise -> 1
            // For inner corners (odd indices), we go around the inside -> counter-clockwise -> 0
            const isOuterCorner = i % 2 === 0;
            const sweepFlag = isOuterCorner ? 1 : 0;
            
            pathCommands.push(`A ${effectiveRadius} ${effectiveRadius} 0 0 ${sweepFlag} ${endPoint.x} ${endPoint.y}`);
          }
          pathCommands.push('Z');
          starPathData = pathCommands.join(' ');
        } else {
          // Create sharp star path
          starPathData = `M ${starPoints[0].x} ${starPoints[0].y}`;
          for (let i = 1; i < totalVertices; i++) {
            starPathData += ` L ${starPoints[i].x} ${starPoints[i].y}`;
          }
          starPathData += ' Z';
        }
        
        return (
          <Path
            data={starPathData}
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            dash={getDash()}
          />
        );
      }
      default:
        return (
          <Rect 
            width={width} 
            height={height} 
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            dash={getDash()}
            cornerRadius={cornerRadius || 0} 
          />
        );
    }
  };

  return (
    <BaseElement {...props}>
      {renderShape()}
      {children}
    </BaseElement>
  );
}
