import firebase from 'firebase'

export default {
  actions: {
    async createCategory({ commit, dispatch }, { name, limit, type }) {
      try {
        const uid = await dispatch('getUid')
        const category = await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .push({ name, limit, type })
        return { name, limit, id: category.key, type }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async deleteCategory({ commit, dispatch }, id) {
      try {
        const uid = await dispatch('getUid')
        await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .child(id)
          .remove()
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateCategory({ commit, dispatch }, { name, limit, id, type }) {
      try {
        const uid = await dispatch('getUid')
        await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .child(id)
          .update({ name, limit, type })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchCategories({ commit, dispatch }) {
      try {
        const uid = await dispatch('getUid')
        const categories =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/categories`)
              .once('value')
          ).val() || {}
        return Object.keys(categories).map((key) => ({
          ...categories[key],
          id: key,
        })) //Добавляем id
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchCategoryById({ commit, dispatch }, id) {
      try {
        const uid = await dispatch('getUid')
        const category =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/categories`)
              .child(id)
              .once('value')
          ).val() || {}
        return { ...category, id } //Добавляем id
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
  },
}
