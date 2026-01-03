import { ToolType } from '../../types/ToolType';
import { IMouseAction } from '../interfaces/IMouseAction';
import { MouseAction as SelectionMouseAction } from './select/MouseAction';
import { MouseAction as RectangleMouseAction } from './rectangle/MouseAction';
import { CircleMouseAction } from './circle/CircleMouseAction';
import { MouseAction as TriangleMouseAction } from './triangle/MouseAction';
import { MouseAction as StarMouseAction } from './star/MouseAction';
import { MouseAction as PencilMouseAction } from './pencil/MouseAction';
import { MouseAction as PenMouseAction } from './pen/MouseAction';
import { MouseAction } from './hand/MouseAction';
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
        return new MouseAction();
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
