import Konva from 'konva';
import { DrawMouseAction } from '../base/DrawMouseAction';
import { ToolContext } from '../interfaces/Tool';
import { ElementFactory, DrawElement } from '../../../types/BaseElement';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export class PencilMouseAction extends DrawMouseAction {
  type = 'pencil' as const;

  onMouseDown(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    const { selectedId, elements, updateElement, selectElement } = useWorkspaceStore.getState();
    const { 
      setIsDrawing, setPreviewElement, drawingStyle 
    } = context;

    const pos = this.getPointerPosition(e);
    if (!pos) return;

    setIsDrawing(true);
    this.startPos = pos;
    
    const newEl = ElementFactory.createDefault(this.type, 0, 0);
    const drawEl = newEl as DrawElement;
    drawEl.points = [pos.x, pos.y];
    drawEl.x = 0;
    drawEl.y = 0;
    
    if (drawingStyle) {
      drawEl.stroke = drawingStyle.stroke;
      drawEl.strokeWidth = drawingStyle.strokeWidth;
    }

    setPreviewElement(drawEl);
    
    if (selectedId) {
      const selectedElement = elements.find(el => el.id === selectedId);
      if (selectedElement && selectedElement.isEditing) {
        updateElement(selectedId, { isEditing: false });
      }
    }
    selectElement(null);
  }

  onMouseMove(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    const { isDrawing, previewElement, setPreviewElement } = context;
    
    if (!isDrawing || !previewElement) return;

    const pos = this.getPointerPosition(e);
    if (!pos) return;

    const drawEl = previewElement as DrawElement;
    // Add new point
    const newPoints = (drawEl.points || []).concat([pos.x, pos.y]);
    setPreviewElement(drawEl.update({ points: newPoints }));
  }

  onMouseUp(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    const { isDrawing, previewElement, setPreviewElement, setIsDrawing } = context;

    if (!isDrawing || !previewElement) return;

    const drawEl = previewElement as DrawElement;
    const points = drawEl.points || [];
    
    if (points.length < 4) { // Need at least 2 points
        setIsDrawing(false);
        setPreviewElement(null);
        return;
    }
    
    this.finishDrawing(drawEl, context);
  }
}
