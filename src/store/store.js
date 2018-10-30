import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* @params
 * car_store: 存储车辆管理 => 增加车辆里需要的信息
 * 
 * orderlist_all: 全部订单列表
 * orderlist_pend: 待确认订单列表
 */

const state = {
    transitionName:'slide',
    showPlacementValue: false,
    headlineTitle:''
}

const mutations = {
	//页面切换样式
    ['SET_TRANSITION_NAME'] (state, value) {
        state.transitionName = value
    },
    //左侧导航显示隐藏
    ['SET_PLACEMENT_VALUE'] (state, boole) {
        state.showPlacementValue = boole
    },
    //左侧导航显示隐藏
    ['SET_HEADLINE_TITLE'] (state, value) {
        state.headlineTitle = value
    },

    ['SET_MANANGER_INFO'] (state, data) {
        state.manangerInfo = data
    },
}

export default new Vuex.Store({
    state,
    mutations,
    strict: true
})
