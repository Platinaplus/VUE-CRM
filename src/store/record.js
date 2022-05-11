import firebase from 'firebase'

export default {
  actions: {
    async createRecord({ dispatch, commit }, record) {
      try {
        const uid = await dispatch('getUid')
        return await firebase
          .database()
          .ref(`/users/${uid}/records`)
          .push(record)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async deleteRecord({ commit, dispatch }, id) {
      try {
        const uid = await dispatch('getUid')
        await firebase
          .database()
          .ref(`/users/${uid}/records`)
          .child(id)
          .remove()
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecords({ commit, dispatch }) {
      try {
        const uid = await dispatch('getUid')
        const records =
          (
            await firebase.database().ref(`/users/${uid}/records`).once('value')
          ).val() || {}
        return Object.keys(records).map((key) => ({ ...records[key], id: key }))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecordById({ commit, dispatch }, id) {
      try {
        const uid = await dispatch('getUid')
        const record =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/records`)
              .child(id)
              .once('value')
          ).val() || {}
        return { ...record, id }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async deleteRecordsInCategory({ commit, dispatch }, id) {
      try {
        const uid = await dispatch('getUid')
        const allRecords =
          (
            await firebase.database().ref(`/users/${uid}/records`).once('value')
          ).val() || {}
        const ids = Object.keys(allRecords)
          .map((key) => ({ ...allRecords[key], id: key }))
          .filter((record) => record.categoryId == id)
          .map((record) => record.id)
        if (ids.length !== 0) {
          ids.forEach((id) => this.deleteRecord(id))
        }
      } catch (e) {
        commit('setError', e)
      }
    },
  },
}
