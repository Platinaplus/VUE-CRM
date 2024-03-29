/* eslint-disable no-useless-catch */
import firebase from "firebase";
import router from '@/router'

export default {
  actions: {
    // eslint-disable-next-line no-empty-pattern
    async login({ commit }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async logout({ commit }) {
      await firebase.auth().signOut();
      commit("clearInfo"); //mutations вызываются через метод commit
    },
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = await dispatch("getUid"); //actions вызываются через метод dispatch
        await firebase.database().ref(`/users/${uid}/info`).set({
          bill: 10000,
          name,
          locale: 'en-US'
        });
        router.push("/");
      } catch (e) {
        console.log(e);
        commit("setError", e);
        throw e;
      }
    },
    async getUid() {
      const user = await firebase.auth().currentUser;
      return user ? user.uid : null;
    },
  },
};
