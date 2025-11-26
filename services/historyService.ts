
export interface HistoryAction {
    name: string;
    undo: () => void;
    redo: () => void;
}

let undoStack: HistoryAction[] = [];
let redoStack: HistoryAction[] = [];
let listeners: (() => void)[] = [];

export const addAction = (action: HistoryAction) => {
    undoStack.push(action);
    redoStack = []; // Clear redo stack on new action
    notify();
};

export const undo = () => {
    const action = undoStack.pop();
    if (action) {
        action.undo();
        redoStack.push(action);
        notify();
    }
};

export const redo = () => {
    const action = redoStack.pop();
    if (action) {
        action.redo();
        undoStack.push(action);
        notify();
    }
};

export const getUndoStack = () => [...undoStack];
export const getRedoStack = () => [...redoStack];

export const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
};

const notify = () => {
    listeners.forEach(l => l());
};
