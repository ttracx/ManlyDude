/**
 * Zustand store for training plans state management.
 * Handles UI state, filters, and selected plan.
 */
import { create } from 'zustand';
import type { TrainingPlan, GenerateTrainingPlanRequest } from '@manlydude/shared';

/** Filter options for the training plans list */
export interface TrainingPlansFilter {
  status?: 'active' | 'paused' | 'completed' | 'archived';
}

/** State shape for the training plans store */
export interface TrainingPlansState {
  /** Currently selected/viewed plan */
  selectedPlan: TrainingPlan | null;
  /** Current week being viewed in a plan */
  currentWeekIndex: number;
  /** Current day being viewed in a plan */
  currentDayIndex: number;
  /** Active filters for the plans list */
  filter: TrainingPlansFilter;
  /** Whether the generate plan modal is open */
  isGenerateModalOpen: boolean;
  /** Draft generate request form state */
  generateDraft: Partial<GenerateTrainingPlanRequest>;

  // Actions
  /** Set the selected training plan */
  setSelectedPlan: (plan: TrainingPlan | null) => void;
  /** Set the current week index being viewed */
  setCurrentWeekIndex: (index: number) => void;
  /** Set the current day index being viewed */
  setCurrentDayIndex: (index: number) => void;
  /** Update list filters */
  setFilter: (filter: TrainingPlansFilter) => void;
  /** Open or close the generate modal */
  setIsGenerateModalOpen: (open: boolean) => void;
  /** Update the generate plan draft form */
  updateGenerateDraft: (partial: Partial<GenerateTrainingPlanRequest>) => void;
  /** Reset the generate draft to empty */
  resetGenerateDraft: () => void;
}

/** Training plans Zustand store */
export const useTrainingPlansStore = create<TrainingPlansState>((set) => ({
  selectedPlan: null,
  currentWeekIndex: 0,
  currentDayIndex: 0,
  filter: {},
  isGenerateModalOpen: false,
  generateDraft: {},

  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  setCurrentWeekIndex: (index) => set({ currentWeekIndex: index }),

  setCurrentDayIndex: (index) => set({ currentDayIndex: index }),

  setFilter: (filter) => set({ filter }),

  setIsGenerateModalOpen: (open) => set({ isGenerateModalOpen: open }),

  updateGenerateDraft: (partial) =>
    set((state) => ({
      generateDraft: { ...state.generateDraft, ...partial },
    })),

  resetGenerateDraft: () => set({ generateDraft: {} }),
}));
