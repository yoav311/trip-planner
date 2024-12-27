const STORAGE_KEY = 'trip_planner_lists';
const DEFAULT_GROUPS = [
  { value: 'essentials', label: 'Essentials' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'hygiene', label: 'Hygiene' },
  { value: 'first-aid', label: 'First Aid' },
  { value: 'misc', label: 'Miscellaneous' }
];

export const listService = {
  getAllLists() {
    const lists = localStorage.getItem(STORAGE_KEY);
    return lists ? JSON.parse(lists).map(list => ({
      ...list,
      groups: list.groups || DEFAULT_GROUPS
    })) : [];
  },

  getList(id) {
    const lists = this.getAllLists();
    const list = lists.find(list => list.id === id);
    if (list && !list.groups) {
      list.groups = DEFAULT_GROUPS;
    }
    return list;
  },

  saveList(list) {
    const lists = this.getAllLists();
    const existingIndex = lists.findIndex(l => l.id === list.id);
    
    const listToSave = {
      ...list,
      groups: list.groups || DEFAULT_GROUPS,
      id: list.id || Date.now().toString(),
      createdAt: list.createdAt || new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      lists[existingIndex] = listToSave;
    } else {
      lists.push(listToSave);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    return listToSave;
  },

  deleteList(id) {
    const lists = this.getAllLists();
    const filteredLists = lists.filter(list => list.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLists));
  },

  duplicateList(id) {
    const list = this.getList(id);
    if (!list) return null;
    
    const newList = {
      ...list,
      id: Date.now().toString(),
      name: `${list.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    
    const lists = this.getAllLists();
    lists.push(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    return newList;
  }
};