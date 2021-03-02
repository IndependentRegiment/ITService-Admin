import { request } from "./request";

// export function getSourceList() {
//     return request({
//         url: 'source/listjson'
//     })
// }
// export function getHomeGoods(type, page) {
//     return request({
//         url: '/home/data',
//         //路由参数
//         params: {
//             type,
//             page
//         }
//     })

// }
export function getList(queryInfo) {//获取工单列表
    return request({
        method: 'post',
        url: `/api1.0/manage/card/list`,
        data: queryInfo
    })
}
export function getDeal(name) {//获取工程师列表
    return request({
        method: 'post',
        header: {
            'content-type': 'application/json',
        },
        url: `/api1.0/card/assist/list`,
        data: { deal: name }
    })
}
export function editDeal(cardId, openId) {//修改工单工程师
    return request({
        method: 'post',
        header: {
            'content-type': 'application/json',
        },
        url: `/api1.0/manage/update/card`,
        data: { deal: openId, cardId: cardId }
    })
}
export function getType() {//获取故障类型列表
    return request({
        method: 'post',
        url: `/api1.0/card/problem/list`,
        data: {}
    })
}
export function getWay() {//获取问题服务类型列表
    return request({
        method: 'post',
        url: `/api1.0/manage/problem/service`,
        data: {}
    })
}
export function addType(id, name, wayId) {//增加类型
    return request({
        method: 'post',
        url: `/api1.0/manage/create/problem`,
        data: {
            typeId: id,
            typeName: name,
            serviceId: wayId
        }
    })
}
export function delType(id) {//删除类型
    return request({
        method: 'post',
        url: `/api1.0/manage/delete/problem`,
        data: {
            typeId: id
        }
    })
}
export function getRoleType() {//获取角色列表
    return request({
        method: 'post',
        url: `/api1.0/manage/user/role`,
        data: {}
    })
}
export function getRole(posData) {//获取用户角色列表
    return request({
        method: 'post',
        url: `/api1.0/manage/user/list`,
        data: posData
    })
}
export function editRole(posData) {//修改用户角色
    return request({
        method: 'post',
        url: `/api1.0/manage/update/user`,
        data: posData
    })
}

export function editNo(posData) {//修改故障类排序
    return request({
        method: 'post',
        url: `/api1.0/manage/update/problem`,
        data: posData
    })
}
//获取当日总工单
export function getCount(posData) {
    return request({
        method: 'post',
        url: `/api1.0/manage/card/count`,
        data: posData
    })
}

//获取月度统计图表
export function getMonthPort(posData) {
    return request({
        method: 'post',
        url: `/api1.0/manage/user/comment`,
        data: posData
    })
}
//服务方式
export function serveWays(posData) {
    return request({
        method: 'post',
        url: `/api1.0/manage/service/count`,
        data: posData
    })
}

export function getRoleScore(posData) {//按季度统计工程师满意度
    return request({
        method: 'post',
        url: `/api1.0/manage/eng/comment`,
        data: posData
    })
}

export function sendMail(posData) {//发送邮件
    return request({
        method: 'post',
        url: `/api1.0/manage/send/email`,
        data: { cardList: posData }
    })
}

