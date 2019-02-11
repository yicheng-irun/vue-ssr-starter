<template>
    <div id="app">
        <h1 class="title">Page1</h1>
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
    color #f00;
}

p.content {
    margin 20px;
}

</style>
