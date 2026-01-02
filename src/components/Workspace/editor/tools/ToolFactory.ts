import { ToolType } from '../../types/ToolType';
import { IMouseAction } from './interfaces/Tool';
import { SelectionMouseAction } from './select/SelectionMouseAction';
import { RectangleMouseAction } from './rectangle/RectangleMouseAction';
import { CircleMouseAction } from './circle/CircleMouseAction';
import { TriangleMouseAction } from './triangle/TriangleMouseAction';
import { StarMouseAction } from './star/StarMouseAction';
import { PencilMouseAction } from './pencil/PencilMouseAction';
import { PenMouseAction } from './pen/PenMouseAction';
import { HandMouseAction } from './hand/HandMouseAction';
import { ShapeMouseAction } from './base/ShapeMouseAction';

export class ToolFactory {
  static createTool(type: ToolType): IMouseAction {
    switch (type) {
      case 'select':
        return new SelectionMouseAction();
      case 'rectangle':
        return new RectangleMouseAction();
      case 'circle':
        return new CircleMouseAction();
      case 'triangle':
        return new TriangleMouseAction();
      case 'star':
        return new StarMouseAction();
      case 'pencil':
        return new PencilMouseAction();
      case 'pen':
        return new PenMouseAction();
      case 'hand':
        return new HandMouseAction();
      default:
        // Generic shapes that use the standard ShapeMouseAction implementation
        const genericShapes: ToolType[] = [
          'chat-bubble', 
          'arrow-left', 
          'arrow-right', 
          'rectangle-text', 
          'circle-text', 
          'text', 
          'image'
        ];

        if (genericShapes.includes(type)) {
            return new ShapeMouseAction(type);
        }
        
        console.warn(`Tool type "${type}" not implemented, falling back to SelectionMouseAction`);
        return new SelectionMouseAction();
    }
  }
}
