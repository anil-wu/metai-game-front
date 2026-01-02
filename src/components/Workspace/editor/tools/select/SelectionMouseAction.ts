import Konva from 'konva';
import { BaseMouseAction } from '../base/BaseMouseAction';
import { ToolContext } from '../interfaces/Tool';
import { ToolType } from '../../../types/ToolType';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export class SelectionMouseAction extends BaseMouseAction {
  type: ToolType = 'select';

  onMouseDown(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    const { selectedId, elements, updateElement, selectElement } = useWorkspaceStore.getState();

    // Only handle clicks on the stage background (empty area)
    if (e.target === e.target.getStage()) {
      if (selectedId) {
        const selectedElement = elements.find(el => el.id === selectedId);
        if (selectedElement && selectedElement.isEditing) {
          updateElement(selectedId, { isEditing: false });
        }
      }
      selectElement(null);
    }
    
    // Note: Clicking on an element is handled by the element's onClick handler,
    // which calls selectElement. We don't need to handle it here unless we want
    // to override that behavior.
  }

  onMouseMove(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    // Selection tool might handle box selection here in the future
  }

  onMouseUp(e: Konva.KonvaEventObject<MouseEvent>, context: ToolContext): void {
    // Nothing to do for now
  }
}
