'use strict'

/**
 * 小程序配置文件
 */

let host = 'https://ssl.3wchina.net/kaixinmami1.0/public/index/admin_api/'
// let host ='https://xcx.kaixinmm.cn/index/admin_api/';
let config = {
  // 是否开启调试输出
  log: true,
  // 下面的地址配合云端 Demo 工作
  service: {
    host: host,

    // 登录地址，用于建立会话
    login: `${host}login`, // 登陆
    index: `${host}index`, // 首页
    calorie_recard: `${host}calorie_recard`, // 打开列表获取
    get_food_type: `${host}get_food_type`,// 食物分类
    custom_food_list: `${host}custom_food_list`, // 自定义食物列表
    get_food_energy: `${host}get_food_energy`,// 系统食物列表
    calorie_recard_add: `${host}calorie_recard_add`,// 添加,修改打卡记录
    calorie_recard_del: `${host}calorie_recard_del`,// 删除打卡记录
    upload: `${host}upload`,// 图片上传
    exercise_consumption_list: `${host}exercise_consumption_list`, //  自定义运动列表
    add_custom_food: `${host}add_custom_food`, // 添加自定义食物
    exercise_consumption_add: `${host}exercise_consumption_add`, // 添加自定义运动
    custom_food_del: `${host}custom_food_del`, // 删除自定义食物
    exercise_consumption_del: `${host}exercise_consumption_del`, // 删除自定义运动

    common_movement: `${host}common_movement`, //  常见运动列表
    testing: `${host}testing`,
    binding: `${host}binding`,  //绑定账号信息
    food_search: `${host}food_search`, //  食物搜索
    trend: `${host}trend`,  // 趋势图标数据
    testing_index: `${host}testing_index`,
    // 问答
    question_list: `${host}question_list`, // 问答列表
    question_add: `${host}question_add`,// 问题提问
    question_detile: `${host}question_detile`, // 问题详情
    solve_problem: `${host}solve_problem`, // 解决问题

    // 报告
    report_list: `${host}report_list`, // 报告列表
    report_detile: `${host}report_detile`, // 报告详情
    edit_user: `${host}edit_user`, // 提交个人资料
    logout: `${host}logout`,  //  退出
    get_calorie_guide_list: `${host}get_calorie_guide_list`,  //  每日指导

    //血压
    get_blood_pressure_list: `${host}get_blood_pressure_list`, //获取血压历史记录
    get_blood_pressure: `${host}get_blood_pressure`, //获取当天血压
    add_blood_pressure: `${host}add_blood_pressure`,//添加血压
    // 血糖
    get_blood_sugar_list:`${host}get_blood_sugar_list`, //获取血糖历史记录
    get_blood_sugar:`${host}get_blood_sugar`, //获取当天血糖
    add_blood_sugar:`${host}add_blood_sugar`, //添加血糖
  }
}

module.exports = config
