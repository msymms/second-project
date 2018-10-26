import Vuex from "vuex";
import Cookie from 'js-cookie';

const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: [],
            token: null
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts;
            },
            addPost(state, post) {
                state.loadedPosts.push(post)
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
                state.loadedPosts[postIndex] = editedPost
            },
            setToken(state, token) {
                state.token = token;
            },
            clearToken(state) {
                state.token = null;
            }
        },
        actions: {
            nuxtServerInit(vuexContext, context) {
                return context.app.$axios.get('/posts.json')
                    .then(res => {
                        const postArray = [];
                        for (const key in res.data) {
                            postArray.push({...res.data[key], id: key})
                        }
                        vuexContext.commit('setPosts', postArray)
                    })
                    .catch(e => console.log(e))
            },
            setPosts(vuexContext, posts) {
                vuexContext.commit("setPosts", posts);
            },
            addPost(vuexContext, post) {
                const createdPost = {...post, updatedDate: new Date()};
                return this.$axios.post(`/posts.json?auth=${vuexContext.state.token}`, createdPost)
                    .then(res => {
                        vuexContext.commit('addPost', {...createdPost, id: res.data.name});
                    })
                    .catch(error => console.log(error));
            },
            editPost(vuexContext, editedPost) {
                return this.$axios.put(`/posts/${editedPost.id}.json?auth=${vuexContext.state.token}`, {
                    ...editedPost,
                    updatedDate: new Date()
                })
                    .then(res => {
                        vuexContext.commit('editPost', editedPost)
                    })
                    .catch(e => console.log(e))
            },
            authenticateUser(vuexContext, authData) {
                let authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=';
                let apiKey = 'AIzaSyAf70_LYR5rCC9-Bf0oV8vaU3mxbnPNhnU';
                if (!authData.isLogin) {
                    authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=';
                }
                return this.$axios.post(
                    `${authURL}${apiKey}`,
                    {
                        email: authData.email,
                        password: authData.password,
                        returnSecureToken: true
                    })
                    .then(data => {
                        const token = data.data.idToken;
                        const expiresIn = data.data.expiresIn;
                        const expirationTime = new Date().getTime() + (expiresIn * 1000);
                        vuexContext.commit("setToken", token);
                        localStorage.setItem('token', token);
                        localStorage.setItem('tokenExpiration', expirationTime);
                        Cookie.set('token', token);
                        Cookie.set('expirationDate', expirationTime);
                    })
                    .catch(e => console.log(e.response));
            },
            initAuth(vuexContext, req) {
                //if we are running on the server get the authentication from the cookie
                let expirationDate = null;
                let token = null;
                if (req) {
                    if (!req.headers.cookie) {
                        return;
                    }
                    const tknCookie = req.headers.cookie
                        .split(';')
                        .find(c => c.trim().startsWith('token'));
                    if (!tknCookie) {
                        return;
                    }
                    token = tknCookie.split('=')[1];
                    const tknExpirationTime = req.headers.cookie
                        .split(';')
                        .find(c => c.trim().startsWith('expiration'));
                    expirationDate = tknExpirationTime.split('=')[1];

                } else {
                    token = localStorage.getItem('token');
                    expirationDate = localStorage.getItem('tokenExpiration');
                }
                if (new Date().getTime() > +expirationDate || !token) {
                    vuexContext.commit('logout');
                }
                vuexContext.commit('setToken', token);
            },
            logout(vuexContext) {
                vuexContext.commit('clearToken');
                Cookie.remove('token');
                Cookie.remove('expirationDate');
                if (process.client) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiration');
                }
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts;
            },
            isAuthenticated(state) {
                return state.token != null;
            }

        }
    });
};

export default createStore;
