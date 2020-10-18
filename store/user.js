import Cookies from 'js-cookie';
import firebase from '~/plugins/firebase';

export const state = () => ({
  user: {
    isLogin: false,
    uid: '',
    email: '',
    icon: '',
    name: '',
  },
  wisdom: {
    likedPost: '',
  },
});

export const getters = {
  uid(state) {
    return state.user.uid;
  },
  isAuthenticated(state) {
    return state.user.isLogin;
  },
  email(state) {
    return state.user.email;
  },
  name(state) {
    return state.user.name;
  },
  icon(state) {
    return state.user.icon;
  },
  likedPost(state) {
    return state.wisdom.likedPost;
  },
};

export const mutations = {
  getData(state, payload) {
    state.user.uid = payload.uid;
    state.user.email = payload.email;
  },
  switchLogin(state) {
    state.user.isLogin = true;
  },
  setUserInfo(state, payload) {
    state.user.name = payload.name;
    state.user.icon = payload.icon;
  },
  setUserWisdom(state, payload) {
    console.log(payload);
    state.wisdom.likedPost = payload;
  },
  changeName(state, latestName) {
    state.user.name = latestName;
  },
  changeIcon(state, latestIcon) {
    state.user.icon = latestIcon;
  },
};

export const actions = {
  login({ commit }, payload) {
    Cookies.set('accessToken', payload.token, { expires: 365 });
    commit('getData', {
      uid: payload.uid,
      email: payload.email,
    });
    commit('switchLogin');
  },
  async getUserInfo({ commit, state }) {
    const userInfo = await firebase
      .firestore()
      .collection('users')
      .doc(state.user.uid)
      .get()
      .then((doc) => {
        const userData = {
          name: doc.data().name,
          icon: doc.data().icon,
        };
        return userData;
      });
    commit('setUserInfo', userInfo);
  },
  async getUserWisdom({ commit, state }) {
    const usersWisdoms = await firebase
      .firestore()
      .collection('users')
      .doc(state.user.uid)
      .collection('wisdom')
      .doc('likedPost')
      .get()
      .then((doc) => {
        return doc.data().id;
      });
    commit('setUserWisdom', usersWisdoms);
  },
};
