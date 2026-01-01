"use client";

import React from 'react';
import { BaseElement } from '../types/BaseElement';
import RectangleToolbar from './RectangleToolbar';
import CircleToolbar from './CircleToolbar';
import TriangleToolbar from './TriangleToolbar';
import StarToolbar from './StarToolbar';
import ChatBubbleToolbar from './ChatBubbleToolbar';
import ArrowToolbar from './ArrowToolbar';
import TextRectangleToolbar from './TextRectangleToolbar';
import TextCircleToolbar from './TextCircleToolbar';

interface ShapeToolbarProps {
  element: BaseElement;
  onUpdate: (updates: Partial<any>) => void;
  onDownload?: () => void;
}

export default function ShapeToolbar(props: ShapeToolbarProps) {
  const { element } = props;

  switch (element.type) {
    case 'rectangle':
      return <RectangleToolbar {...props} />;
    case 'circle':
      return <CircleToolbar {...props} />;
    case 'triangle':
      return <TriangleToolbar {...props} />;
    case 'star':
      return <StarToolbar {...props} />;
    case 'chat-bubble':
      return <ChatBubbleToolbar {...props} />;
    case 'arrow-left':
    case 'arrow-right':
      return <ArrowToolbar {...props} />;
    case 'rectangle-text':
      return <TextRectangleToolbar {...props} />;
    case 'circle-text':
      return <TextCircleToolbar {...props} />;
    default:
      return <RectangleToolbar {...props} />;
  }
}
