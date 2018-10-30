<template>
	<div id="header_box">
        <x-header slot="header"
            style="width:100%;position:fixed;left:0;top:0;z-index:100;color:#fff;"
            :title="headObj.title">
            <span slot="overwrite-left" @click="sideBarShow()" v-show="!headObj.isBack">
                <x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
            </span>
            <span slot="overwrite-left" v-show="headObj.isBack" class="iconfont" @click="backWay()">&#xe60e;</span>
            <span slot="right" class="right_style" v-show="rightObj.isMore">
                <span @click="finish()">{{ rightObj.title }}</span>
                <span class="iconfont" @click="finish()" v-html="rightObj.icon"></span>
            </span>
        </x-header>
	</div>
</template>
<script>
import { XHeader} from 'vux'
export default {
    components: {
        XHeader,
    },
    props:{
        isBack: Boolean,
        headObj: Object,
        rightObj: Object,
    },
    data(){
        return {
            sideBarState: false,
        }
    },
    mounted (){
        let self = this;
    },
    methods: {
        sideBarShow (){//点击显示侧栏
            let self = this;
            self.$store.commit('SET_PLACEMENT_VALUE',true);
        },
        backWay (){
            let self = this;
            if(self.headObj.isBack){
                self.$emit('backWay','点击返回')
            }
            // self.$router.back(self.pathWay)
        },
        finish(){
            let self = this;
            if(self.rightObj.isMore){
                self.$emit('listFinish','点击完成')
            }
        }
    },
}
</script>
<style lang="less" scoped>
@import '~vux/src/styles/close.less';
.right_style{
    color: #fff;
}
</style>