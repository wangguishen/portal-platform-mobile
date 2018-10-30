<template>
    <div id="page_box">
        <v-header :headObj="headObj" :rightObj="rightObj"></v-header>
        <div class="container_top jurisdiction">
            <div v-for="obj in objItems">
                <group>
                    <cell
                        :title="obj.name"
                        is-link
                        @click.native="jumpPage(obj)">
                    </cell>
                </group>
            </div>
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellBox, LoadMore } from 'vux'
export default {
    components: {
        VHeader, Group, Cell, LoadMore, CellBox
    },
    data(){
        return {
            headObj:{
                title: '用户信息',
                isBack: false,
            },
            rightObj:{
                isMore: false,
            },
            items: [],
            objItems: [
                {
                    id: 999,
                    name: "账户信息",
                    route: '/usermessage',
                },
                // {
                //     id: 1000,
                //     name: "修改密码",
                //     route: '/userpassword',
                // }
            ],
        }
    },
    mounted(){
        let self = this;
    },
    methods: {
        jumpPage(item){//跳转
            let self = this;
            self.$router.go(item.route);
        },
    },
}
</script>
<style lang="less" scoped>
    .box2-wrap {
        height: 300px;
        overflow: hidden;
    }
    .sub-item{
        color:#666;
    }
</style>