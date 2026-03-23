/**
 * Tests for the training plans Zustand store.
 */
import { useTrainingPlansStore } from '../store/training-plans-store';

describe('TrainingPlansStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTrainingPlansStore.setState({
      selectedPlan: null,
      currentWeekIndex: 0,
      currentDayIndex: 0,
      filter: {},
      isGenerateModalOpen: false,
      generateDraft: {},
    });
  });

  it('initializes with default state', () => {
    const state = useTrainingPlansStore.getState();
    expect(state.selectedPlan).toBeNull();
    expect(state.currentWeekIndex).toBe(0);
    expect(state.currentDayIndex).toBe(0);
    expect(state.filter).toEqual({});
    expect(state.isGenerateModalOpen).toBe(false);
    expect(state.generateDraft).toEqual({});
  });

  it('sets selected plan', () => {
    const mockPlan = { id: 'plan-1', name: 'Test Plan' } as any;
    useTrainingPlansStore.getState().setSelectedPlan(mockPlan);
    expect(useTrainingPlansStore.getState().selectedPlan).toEqual(mockPlan);
  });

  it('clears selected plan', () => {
    useTrainingPlansStore.getState().setSelectedPlan(null);
    expect(useTrainingPlansStore.getState().selectedPlan).toBeNull();
  });

  it('sets current week index', () => {
    useTrainingPlansStore.getState().setCurrentWeekIndex(3);
    expect(useTrainingPlansStore.getState().currentWeekIndex).toBe(3);
  });

  it('sets current day index', () => {
    useTrainingPlansStore.getState().setCurrentDayIndex(5);
    expect(useTrainingPlansStore.getState().currentDayIndex).toBe(5);
  });

  it('opens and closes generate modal', () => {
    useTrainingPlansStore.getState().setIsGenerateModalOpen(true);
    expect(useTrainingPlansStore.getState().isGenerateModalOpen).toBe(true);
    useTrainingPlansStore.getState().setIsGenerateModalOpen(false);
    expect(useTrainingPlansStore.getState().isGenerateModalOpen).toBe(false);
  });

  it('updates generate draft', () => {
    useTrainingPlansStore.getState().updateGenerateDraft({ goal: 'muscle_gain' });
    expect(useTrainingPlansStore.getState().generateDraft.goal).toBe('muscle_gain');

    useTrainingPlansStore.getState().updateGenerateDraft({ frequency: 4 });
    expect(useTrainingPlansStore.getState().generateDraft.goal).toBe('muscle_gain');
    expect(useTrainingPlansStore.getState().generateDraft.frequency).toBe(4);
  });

  it('resets generate draft', () => {
    useTrainingPlansStore.getState().updateGenerateDraft({ goal: 'strength', frequency: 5 });
    useTrainingPlansStore.getState().resetGenerateDraft();
    expect(useTrainingPlansStore.getState().generateDraft).toEqual({});
  });

  it('sets filter', () => {
    useTrainingPlansStore.getState().setFilter({ status: 'active' });
    expect(useTrainingPlansStore.getState().filter).toEqual({ status: 'active' });
  });
});
