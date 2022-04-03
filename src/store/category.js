import firebase from 'firebase';

export default {
  actions: {
    async createCategory({ commit, dispatch }, { name, limit }) {
      try {
        const uid = await dispatch('getUid');
        const category = await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .push({ name, limit });
        return { name, limit, id: category.key };
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async updateCategory({ commit, dispatch }, { name, limit, id }) {
      try {
        const uid = await dispatch('getUid');
        await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .child(id)
          .update({ name, limit });
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
    async fetchCategories({ commit, dispatch }) {
      try {
        const uid = await dispatch('getUid');
        const categories =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/categories`)
              .once('value')
          ).val() || {};
        return Object.keys(categories).map(key => ({...categories[key], id: key})) //Добавляем id
      } catch (e) {
        commit('setError', e);
        throw e;
      }
    },
  },
};
