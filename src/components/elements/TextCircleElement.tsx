import React from 'react';
import { Ellipse } from 'react-konva';
import TextShapeElement, { TextShapeElementProps } from './TextShapeElement';

export default function TextCircleElement(props: TextShapeElementProps) {
  const { width, height, color = '#3b82f6', stroke, strokeWidth, strokeStyle } = props;
  
  const dash = strokeStyle === 'dashed' ? [10, 5] : (strokeStyle === 'dotted' ? [2, 2] : undefined);

  return (
    <TextShapeElement {...props}>
      <Ellipse
         x={width / 2}
         y={height / 2}
         radiusX={width / 2}
         radiusY={height / 2}
         fill={color}
         stroke={stroke}
         strokeWidth={strokeWidth}
         dash={dash}
      />
    </TextShapeElement>
  );
}
