<template>
    <div id="page_box">
        <v-header v-on:backWay="backWay" :headObj="headObj" :rightObj="rightObj"></v-header>
        <div class="container_top jurisdiction">
            <div>
                <group>
                    <cell title="登录名" :value="message.account"></cell>
                    <cell title="账户名" :value="message.adminName"></cell>
                    <cell title="登录身份" :value="message.name"></cell>
                    <cell title="性别" :value="message.name_sex"></cell>
                    <cell title="邮箱" :value="message.email"></cell>
                    <cell title="昵称" :value="message.nick"></cell>
                    <cell title="手机号码" :value="message.mobile"></cell>
                    <cell title="企业编码" :value="message.enterpriseCode"></cell>
                </group>
            </div>
        </div>
    </div>
</template>
<script>
import VHeader from '../../common/Header'
import { Group, Cell, CellBox, LoadMore,SwipeoutItem } from 'vux'
export default {
    components: {
        VHeader, Group, Cell, LoadMore, CellBox,SwipeoutItem
    },
    data(){
        return {
            headObj:{
                title: '账户信息',
                isBack: true,
            },
            rightObj:{
                isMore: false,
            },
            message:{},
        }
    },
    mounted(){
        let self = this;
        let msgStorage = JSON.parse(localStorage.getItem('jsonData'));
        msgStorage.sex?msgStorage.name_sex = '男' : msgStorage.name_sex = '女';
        self.message = msgStorage;
        console.log(msgStorage);
    },
    methods: {
        backWay(){
            let self = this;
            self.$router.back('/userhome');
        }
    },
}
</script>
<style lang="less" scoped>
</style>