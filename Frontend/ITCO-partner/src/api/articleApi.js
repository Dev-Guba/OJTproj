import { STORAGE_KEYS } from "../utils/storageKeys";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES)) || [];
  } catch {
    return [];
  }
};

const write = (data) => {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data));
};

export const articlesApi = {
  async getAll() {
    return read();
  },

  async create(payload) {
    const items = read();
    const newItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...payload,
    };
    items.unshift(newItem);
    write(items);
    return newItem;
  },

  async update(id, payload) {
    const items = read();
    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error("Record not found");
    items[idx] = { ...items[idx], ...payload, updatedAt: new Date().toISOString() };
    write(items);
    return items[idx];
  },

  async remove(id) {
    const items = read().filter((x) => x.id !== id);
    write(items);
    return true;
  },
};