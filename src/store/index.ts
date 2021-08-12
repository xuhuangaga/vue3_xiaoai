import { createStore } from "vuex";

export default createStore({
  state: {
    tags: JSON.parse(localStorage.getItem('tags')!)
  },
  mutations: {
    setTags(state, data) {
      state.tags = data
    }
  },
  actions: {},
  modules: {},
});
