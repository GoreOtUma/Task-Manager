import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы группировок
type GroupByType = 'none' | 'priority' | 'tag';

const isGroupByType = (value: any): value is GroupByType => {
  return ['none', 'priority', 'tag'].includes(value);
};

interface FiltersState {
  status: string;
  priority: string;
  search: string;
  dueDate: string;
  tags: string;
  groupBy: GroupByType;
}

const loadFilters = (): FiltersState => {
  const savedFilters = localStorage.getItem('filters');
  if (savedFilters) {
    try {
      const parsed = JSON.parse(savedFilters);
      // Проверяем и корректируем groupBy
      return {
        ...parsed,
        groupBy: isGroupByType(parsed.groupBy) ? parsed.groupBy : 'none',
      };
    } catch (e) {
      // В случае ошибки парсинга возвращаем initialState
      return {
        status: 'all',
        priority: 'all',
        search: '',
        dueDate: 'all',
        tags: '',
        groupBy: 'none',
      };
    }
  }
  // Если нет сохраненных фильтров, возвращаем initialState
  return {
    status: 'all',
    priority: 'all',
    search: '',
    dueDate: 'all',
    tags: '',
    groupBy: 'none',
  };
};

const initialState: FiltersState = loadFilters();

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ type: keyof Omit<FiltersState, 'groupBy'>; value: string }>) => {
      const { type, value } = action.payload;
      (state[type] as string) = value;
      localStorage.setItem('filters', JSON.stringify(state));
    },
    setGroupBy: (state, action: PayloadAction<GroupByType>) => {
      state.groupBy = action.payload;
      localStorage.setItem('filters', JSON.stringify(state));
    },
  },
});

export const { setFilter, setGroupBy } = filtersSlice.actions;
export default filtersSlice.reducer;