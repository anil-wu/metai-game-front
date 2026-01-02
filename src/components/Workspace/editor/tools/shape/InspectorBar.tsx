"use client";

import React from 'react';
import { BaseElement } from '../../../types/BaseElement';
import RectangleInspectorBar from '../rectangle/InspectorBar';
import CircleInspectorBar from '../circle/InspectorBar';
import TriangleInspectorBar from '../triangle/InspectorBar';
import StarInspectorBar from '../star/InspectorBar';
import ChatBubbleInspectorBar from '../chat-bubble/InspectorBar';
import ArrowInspectorBar from '../arrow/InspectorBar';
import TextRectangleInspectorBar from '../text-rectangle/InspectorBar';
import TextCircleInspectorBar from '../text-circle/InspectorBar';

interface ShapeInspectorBarProps {
  element: BaseElement;
  onUpdate: (updates: Partial<any>) => void;
  onDownload?: () => void;
}

export default function ShapeInspectorBar(props: ShapeInspectorBarProps) {
  const { element } = props;

  switch (element.type) {
    case 'rectangle':
      return <RectangleInspectorBar {...props} />;
    case 'circle':
      return <CircleInspectorBar {...props} />;
    case 'triangle':
      return <TriangleInspectorBar {...props} />;
    case 'star':
      return <StarInspectorBar {...props} />;
    case 'chat-bubble':
      return <ChatBubbleInspectorBar {...props} />;
    case 'arrow-left':
    case 'arrow-right':
      return <ArrowInspectorBar {...props} />;
    case 'rectangle-text':
      return <TextRectangleInspectorBar {...props} />;
    case 'circle-text':
      return <TextCircleInspectorBar {...props} />;
    default:
      return <RectangleInspectorBar {...props} />;
  }
}
