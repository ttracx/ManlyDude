import { create } from 'zustand';
import type { WorkoutSession, WorkoutSet } from '@manlydude/shared';
import { generateId } from '@manlydude/shared';

interface ActiveWorkout {
  session: WorkoutSession;
  sets: WorkoutSet[];
}

interface SyncQueueItem {
  id: string;
  type: 'create_session' | 'add_set' | 'update_set' | 'complete_session';
  payload: unknown;
  created_at: string;
}

interface WorkoutState {
  activeWorkout: ActiveWorkout | null;
  syncQueue: SyncQueueItem[];
  startWorkout: (name: string, templateId?: string) => void;
  addSet: (set: Omit<WorkoutSet, 'id' | 'created_at'>) => void;
  completeWorkout: () => void;
  cancelWorkout: () => void;
  addToSyncQueue: (item: Omit<SyncQueueItem, 'id' | 'created_at'>) => void;
  clearSyncQueue: () => void;
}

/** Zustand store for active workout and offline sync queue */
export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  syncQueue: [],

  startWorkout: (name, templateId) => {
    const session: WorkoutSession = {
      id: generateId(),
      user_id: '',
      template_id: templateId || null,
      name,
      started_at: new Date().toISOString(),
      completed_at: null,
      duration_seconds: null,
      notes: null,
      created_at: new Date().toISOString(),
    };
    set({ activeWorkout: { session, sets: [] } });
    get().addToSyncQueue({ type: 'create_session', payload: session });
  },

  addSet: (setData) => {
    const newSet: WorkoutSet = {
      ...setData,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      activeWorkout: state.activeWorkout
        ? { ...state.activeWorkout, sets: [...state.activeWorkout.sets, newSet] }
        : null,
    }));
    get().addToSyncQueue({ type: 'add_set', payload: newSet });
  },

  completeWorkout: () => {
    const { activeWorkout, addToSyncQueue } = get();
    if (!activeWorkout) return;
    const completed = {
      ...activeWorkout.session,
      completed_at: new Date().toISOString(),
    };
    addToSyncQueue({ type: 'complete_session', payload: completed });
    set({ activeWorkout: null });
  },

  cancelWorkout: () => set({ activeWorkout: null }),

  addToSyncQueue: (item) =>
    set((state) => ({
      syncQueue: [
        ...state.syncQueue,
        { ...item, id: generateId(), created_at: new Date().toISOString() },
      ],
    })),

  clearSyncQueue: () => set({ syncQueue: [] }),
}));
