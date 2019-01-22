<template>
    <div
        id="app"
        ref="app"
        class="main"
        style="opacity: 0"
    >
        <nc-header />
    </div>
</template>

<script>
import ncHeader from './comps/nc-header.vue';

export default {
    components: {
        ncHeader
    },
    data () {
        return {
            tab_key: 'tab1'
        }
    },

    methods: {
        tab_onchange () {

        }
    },
    mounted () {
        setTimeout(() => {
            this.$refs.app.style.opacity = 1;
        }, 0);
    }
}
    
</script>

<style lang="stylus">
@import './style/index.styl'
.main {
    transition all 0.3s
}
</style>
