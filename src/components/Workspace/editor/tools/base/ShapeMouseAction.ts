import Konva from 'konva';
import { BaseMouseAction } from './BaseMouseAction';
import { ToolContext } from '../../interfaces/IMouseAction';
import { ToolType } from '../../../types/ToolType';
import { ElementFactory } from '../../../types/BaseElement';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export class ShapeMouseAction extends BaseMouseAction {
  type: ToolType;

  constructor(type: ToolType) {
    super();
    this.type = type;
  }

  onMouseDown(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    const { selectedId, elements, updateElement, selectElement } = useWorkspaceStore.getState();
    const { setIsDrawing, setPreviewElement } = context;

    const pos = this.getPointerPosition(e);
    if (!pos) return;

    // Start drawing
    this.startPos = pos;
    setIsDrawing(true);

    // Create temporary element
    let newEl = ElementFactory.createDefault(this.type, pos.x, pos.y);
    newEl = newEl.update({ width: 0, height: 0 });
    setPreviewElement(newEl);

    // Deselect current
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

    const width = Math.abs(pos.x - this.startPos.x);
    const height = Math.abs(pos.y - this.startPos.y);
    const newX = Math.min(pos.x, this.startPos.x);
    const newY = Math.min(pos.y, this.startPos.y);

    setPreviewElement(previewElement.update({
      x: newX,
      y: newY,
      width,
      height
    }));
  }

  onMouseUp(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    const { addElement, selectElement } = useWorkspaceStore.getState();
    const { 
      isDrawing, previewElement, setPreviewElement, 
      setIsDrawing, onToolChange, onToolUsed 
    } = context;

    if (!isDrawing || !previewElement) return;

    const pos = this.getPointerPosition(e);
    if (!pos) {
       setIsDrawing(false);
       setPreviewElement(null);
       return;
    }

    const dx = pos.x - this.startPos.x;
    const dy = pos.y - this.startPos.y;
    const diagonal = Math.sqrt(dx * dx + dy * dy);

    // Threshold for click vs drag
    if (diagonal < 5) { 
        setIsDrawing(false);
        setPreviewElement(null);
        onToolChange?.('select');
        return;
    }

    addElement(previewElement);
    selectElement(previewElement.id);
    onToolUsed();
    
    setIsDrawing(false);
    setPreviewElement(null);
  }
}
