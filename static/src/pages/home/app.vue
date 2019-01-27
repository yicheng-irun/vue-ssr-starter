<template>
    <div id="app">
        <h1>这是页面的template1111111111</h1>
        <hr>
        <h3>我是msg: {{ state.msg }}</h3>
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
h1 {
    color: rgba(0, 0, 0, 0.5);
}

h3 {
    color: #f00;
}
</style>
