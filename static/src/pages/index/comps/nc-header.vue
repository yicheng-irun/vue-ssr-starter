<template>
    <div class="nc-header">
        <div class="head-container">
            <div class="left">
                <span class="logo">vue-ssr-starter</span>
            </div>
            <div class="right">
                <ul class="head-navs">
                    <li>
                        <a
                            href="https://github.com/yicheng-irun/vue-ssr-starter/"
                            target="_blank"
                        ><i class="fas fa-file-alt"></i> docs</a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/yicheng-irun/vue-ssr-starter/"
                            target="_blank"
                            title="visit"
                        ><i class="fab fa-github"></i> github</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="stylus" scoped>
.nc-header {
    height 60px;
    line-height 60px;
    background-color #fff;
    font-size 18px;
    box-shadow 0 0 8px rgba(0, 0, 0, 0.2);
    >.head-container {
        position relative;
        margin 0 20px;
        >.left {
            display block
        }
        >.right {
            position absolute
            top 0
            right 0
        }
    }
}
.logo {
    font-weight bold
    color rgba(0,0,0,0.6)
}
.head-navs {
    margin 0
    padding 0
    white-space nowrap
    >li {
        margin 0 1px
        padding 0
        display inline-block
        >a {
            font-size 18px;
            color #000000aa
            padding 0 18px
            display inline-block
            text-decoration none
            text-align center
            transition all 0.3s
            &:hover {
                background #00000018
            }
        }
    }
}
</style>
