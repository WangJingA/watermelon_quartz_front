import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import {supermanager} from "../store/supermanager";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/donate',
                name: 'donate',
                meta: {
                    title: '鼓励作者',
                    permiss: '14',
                },
                component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            //调度中心管理
            {
                path:'/WatermelonManage',
                name:'WatermelonManage',
                meta:{
                    title: '调度中心管理',
                },
                children:[
                    {
                        path: '/QuartzManageList',
                        name: 'QuartzManageList',
                        meta: {
                            title: '调度列表'
                        },
                        component:() => import('../views/manager/QuartzManage/QuartzManageList.vue')
                    },
                    {
                        path: '/ScheduleCreate',
                        name: 'ScheduleCreate',
                        meta: {
                            title: '创建调度任务'
                        },
                        component:() => import('../views/manager/QuartzManage/ScheduleCreate.vue')
                    },
                    {
                        path: '/ScheduleLogs',
                        name: 'ScheduleLogs',
                        meta: {
                            title: '执行日志'
                        },
                        component:() => import('../views/manager/QuartzManage/ScheduleLogs.vue')
                    }
                ]
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const superManagerInfo = supermanager()
    const permiss = usePermissStore();
    //增加白名单
    const whiteList = ['/login']
    // if (superManagerInfo.token) {
    //     if (to.path === '/login') {
    //         next({path: '/login'})
    //     }
    // }
    // else {
    //     if (whiteList.indexOf(to.path) > -1) {
    //         next()
    //     }
    //     else {
    //         next('/login')
    //     }
    // }
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
