<template>
    <div>
        <TheHeader @sidenavToggle="displaySidenav = !displaySidenav"/>
        <nuxt/>
    </div>
</template>
<script>
    import TheHeader from '@/components/Navigation/TheHeader'
    export default {
        components: {
            TheHeader
        },
        data () {
            return {
                displaySidenav: false
            }
        }
    }
</script>
<style>
    html {
        font-family: 'Open Sans', sans-serif;
    }
    body {
        margin: 0;
    }
</style>
