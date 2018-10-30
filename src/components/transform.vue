<template>
    <div style="height:100%">
        <drawer
            width="200px;"
            :show.sync="drawerVisibility"
            :show-mode="showModeValue"
            :placement="showPlacementValue"
            :drawer-style="{'background-color':'#000', width: '200px'}">
            <div slot="drawer">
                <group title="Drawer demo(beta)" style="margin-top:20px;">
                    <cell title="Demo" link="/demo" value="演示" @click.native="pathWay()">
                    </cell>
                    <cell title="Buy me a coffee" link="project/donate" @click.native="drawerVisibility = false">
                    </cell>
                    <cell title="Github" link="http://github.com/airyland/vux" value="Star me" @click.native="drawerVisibility = false">
                    </cell>
                </group>
            </div>
            <view-box ref="viewBox">
                <x-header slot="header"
                    style="width:100%;position:absolute;left:0;top:0;z-index:100;"
                    :title="title"
                    :transition="transitionName">
                    <span slot="overwrite-left" @click="drawerVisibility = !drawerVisibility">
                        <x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
                    </span>
                </x-header>
                <!--主体内容视图-->
                <transition :name="transitionName">
                    <router-view class="child-view"></router-view>
                </transition>
            </view-box>
        </drawer>
    </div>
</template>

<script>
import { XHeader, Drawer, ViewBox, Group, Cell } from 'vux'
// import './assets/transition.css'
export default {
    data () {
        return {
            title: '头部',
            transitionName: 'slide',
            showMenu: false,
            drawerVisibility: false,
            showMode: 'push',
            showModeValue: 'push',
            showPlacement: 'left',
            showPlacementValue: 'left'
        }
    },
    beforeRouteUpdate (to, from, next) {
        let isBack = this.$router.isBack
        if (isBack) {
            this.transitionName = 'back'
        } else {
            this.transitionName = 'slide'
        }
        this.$router.isBack = false
        next()
    },
    computed: {
        onClickMore(){
            this.showMenu = true
        }
    },
    methods:{
        pathWay(){
            let self = this;
            self.drawerVisibility = false;
            self.$router.go('/header')
        },
    },
    components: {
        XHeader,
        Drawer,
        ViewBox,
        Group,
        Cell
    }
}
</script>

<style lang="less">
    .select_key{
        fill:#fff;position:relative;top:-8px;left:-3px;
    }
    .child-view {
        position: absolute;
        width:100%;
        transition: all .8s cubic-bezier(.55,0,.1,1);
    }
</style>
