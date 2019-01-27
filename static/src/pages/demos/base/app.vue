<template>
    <div id="app">
        <h1 class="title">A Vue SSR Demo</h1>
        <p class="content">ajax result: {{ state.data }}</p>
    </div>
</template>

<script>

export default {
    name: 'App',

    components: {
    },

    data () {
        return {
        };
    },

    computed: {
        state () {
            return this.$store.state;
        },
    },

    methods: {
    },
};
</script>

<style lang="stylus">
@import './app.styl';

h1.title {
    margin 100px 0 50px 0;
    color: rgba(0, 0, 0, 0.5);
    text-align center;
    font-size 50px;
}

p.content {
    margin 20px;
}

</style>
