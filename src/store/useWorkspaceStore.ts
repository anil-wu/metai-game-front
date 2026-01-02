import { create } from 'zustand';
import { BaseElement, ElementFactory } from '../components/workspace/types/BaseElement';
import { ToolType } from '../components/workspace/types/ToolType';

interface WorkspaceState {
  elements: BaseElement[];
  selectedId: string | null;
  activeTool: ToolType;
  
  // Actions
  setElements: (elements: BaseElement[]) => void;
  selectElement: (id: string | null) => void;
  setActiveTool: (tool: ToolType) => void;
  addElement: (element: BaseElement) => void;
  updateElement: (id: string, updates: Partial<any>) => void;
  removeElement: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => {
  let initialElements: BaseElement[] = [];
  try {
    if (typeof ElementFactory !== 'undefined') {
      initialElements = [ElementFactory.createDefault('image', 100, 100, 'initial-img')];
    } else {
      console.warn('ElementFactory is undefined during store initialization');
    }
  } catch (error) {
    console.error('Failed to create default elements:', error);
  }

  return {
  elements: initialElements,
  selectedId: null,
  activeTool: 'select',

  setElements: (elements) => set({ elements }),
  
  selectElement: (id) => set({ selectedId: id }),
  
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map((el) => 
      el.id === id ? el.update(updates) : el
    )
  })),

  removeElement: (id) => set((state) => ({
    elements: state.elements.filter((el) => el.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
}});
