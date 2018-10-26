<template>
    <div class="admin-page">
        <section class="new-post">
            <AppButton @click="$router.push('/admin/new-post')">Create Post</AppButton>
            <AppButton @click="onLogout">Log Out</AppButton>
        </section>
        <section class="existing-posts">
            <h1>Existing Posts</h1>
            <PostList
                    isAdmin
                    :posts="loadedPosts"/>
        </section>
    </div>
</template>

<script>
    export default {
        layout: 'admin',
        middleware: ['check-auth','auth'],
        computed: {
            loadedPosts() {
                return this.$store.getters.loadedPosts
            }
        },
        methods: {
            onLogout() {
                //clear the state, local storage, and cookies
                //with the action in the store
                this.$store.dispatch('logout');
                //redirect to home page
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>
    .admin-page {
        padding: 20px;
    }

    .new-post {
        text-align: center;
        border-bottom: 2px solid #ccc;
        padding-bottom: 10px;
    }

    .existing-posts h1 {
        text-align: center;
    }
</style>

