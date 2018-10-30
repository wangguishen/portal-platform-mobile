/*
 * set设置、add添加、change修改
 */
//样式切换
export const setTransitionName = ({ dispatch }, value) => {
    dispatch('SET_TRANSITION_NAME', value)
}
//左侧导航
export const set_show_placement_value = ({ dispatch }, boole) => {
    dispatch('SET_PLACEMENT_VALUE', boole)
}

export const setManangerInfo = ({ dispatch }, data) => {
    dispatch('SET_MANANGER_INFO', data)
}

// //字符串
// export const set_string_value = ({ dispatch }, key, value) => {
//     dispatch('SET_STRING_VALUE', key, value)
// }
// //对象
// export const set_object_value = ({ dispatch }, key, data) => {
//     dispatch('SET_OBJECT_VALUE', key, data)
// }
// //数组
// export const set_array_value = ({ dispatch }, key, arr) => {
//     dispatch('SET_ARRAY_VALUE', key, arr)
// }
// //数值
// export const set_number_value = ({ dispatch }, key, number) => {
//     dispatch('SET_NUMBER_VALUE', key, number)
// }
// //布尔
// export const set_boole_value = ({ dispatch }, key, boole) => {
//     dispatch('SET_BOOLE_VALUE', key, boole)
// }