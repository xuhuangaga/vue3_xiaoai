import http from "./"
import qs from 'qs'
import axios from 'axios'

export default {
  //登录验证接口
  //username 用户名
  //password 密码
  login({ username, password }: { username: string, password: string }) {
    return http.post('/login', {
      username,
      password
    })
  },
  //左侧菜单权限
  menus() {
    return http.get('/menus')
  },
  //添加角色
  //roleName 角色名称
  //roleDesc 角色描述 可空
  addRoles({ roleName, roleDesc }: { roleName: string, roleDesc?: string }) {
    return http.post('/roles', {
      roleName,
      roleDesc
    })
  },
  //获取角色列表
  getRolesList() {
    return http.get('/roles')
  },
  //根据id编辑角色列表
  //id:角色 ID
  //roleName:角色名称
  //roleDesc:角色描述
  editRolesById({ id, roleName, roleDesc }: { id: number, roleName: string, roleDesc?: string }) {
    return http.put(`roles/${id}`, {
      roleName: roleName,
      roleDesc: roleDesc
    })
  },
  //删除角色
  //id:角色 ID
  delRolesById({ id }: { id: number }) {
    return http.delete(`roles/${id}`)
  },
  //获取所有权限
  //type:类型 值 list 或 tree , list 列表显示权限, tree 树状显示权限
  getPermissions({ type }: { type: string }) {
    return http.get(`rights/${type}`)
  },
  //角色授权
  //roleId:角色 ID
  //rids:权限 ID 列表（字符串）
  //以 , 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）
  rolesAuthorization({ roleId, rids }: { roleId: number, rids: string }) {
    let r = qs.stringify({ rids })
    return http.post(`roles/${roleId}/rights`, r)
  },
  //获取用户列表
  users({ query, pagenum, pagesize }: { query?: string, pagenum: number, pagesize: number }) {
    return http.get(`/users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
  },
  //删除角色指定权限
  delPermissions({ roleId, rightId }: { roleId: number, rightId: number }) {
    return http.delete(`/roles/${roleId}/rights/${rightId}`)
  },
  //添加用户
  //username：用户名称 不能为空
  //password：用户密码 不能为空
  //email：邮箱 可以为空
  //mobile：手机号 可以为空
  addUsers({ username, password, email, mobile }: { username: string, password: string, email: string, mobile: string }) {
    return http.post('/users', {
      username, password, email, mobile
    })
  },
  //修改用户状态
  // uId 用户 ID 不能为空携带在url中
  // type 用户状态 不能为空携带在url中，值为 true 或者 false
  updateUserState({ uId, type }: { uId: number, type: boolean }) {
    return http.put(`users/${uId}/state/${type}`)
  },
  //根据 ID 查询用户信息
  //id 用户 ID 不能为空携带在url中
  getuserById({ id }: { id: number }) {
    return http.get(`users/${id}`)
  },
  //编辑用户
  //id 不能为空
  //email 邮箱
  //mobile 手机号
  EditUsers({ id, email, mobile }: { id: number, email: string, mobile: string }) {
    return http.put(`users/${id}`, {
      email, mobile
    })
  },
  //删除单个用户
  //id 用户id
  delUserById({ id }: { id: number }) {
    return http.delete(`users/${id}`)
  },
  //分配用户角色
  setUserRole({ id, rid }: { id: number, rid: number }) {
    return http.put(`users/${id}/role`, {
      rid
    })
  },
  //基于时间统计的折线图
  getReports() {
    return http.get('reports/type/1')
  },
  //获取订单
  getOrdes({ query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr }:
    { query?: string, pagenum: number, pagesize: number, user_id?: number | undefined, pay_status?: boolean | undefined, is_send?: boolean | undefined, order_fapiao_title: string, order_fapiao_company: string, order_fapiao_content: string, consignee_addr: string }) {
    // return http.get(`/orders?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}&user_id=${user_id}&pay_status=${pay_status}&
    //   is_send=${is_send}&order_fapiao_title=${order_fapiao_title}&order_fapiao_company=${order_fapiao_company}
    //   &order_fapiao_content=${order_fapiao_content}&consignee_addr=${consignee_addr}`)
    return http.get(`/orders?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
  },
  //修改订单状态
  updateOrderState({ id, is_send, order_pay, order_price, order_number, pay_status }:
    { id: number, is_send: boolean, order_pay: number, order_price: number, order_number: number, pay_status: number }) {
    return http.put(`orders/${id}`, {
      is_send, order_pay, order_price, order_number, pay_status
    })
  },
  //查看订单详情
  getOrdersById({ id }: { id: number }) {
    return http.put(`orders/${id}`)
  },
  //查看物流信息
  kuaidi({ id }: { id: number }) {
    let token = localStorage.getItem('token')
    return axios.get(`https://www.liulongbin.top:8888/api/private/v1/kuaidi/${id}`, {
      headers: {
        Authorization: token
      }
    })
  },
  //获取商品列表
  getGoods({ query, pagenum, pagesize }: { query: string, pagenum: number, pagesize: number }) {
    return http.get(`goods?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
  },
  //添加商品
  addGoods({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }:
    {
      goods_name: string, goods_cat: string, goods_price: number, goods_number: number, goods_weight: number
      , goods_introduce: string, pics: any, attrs: any
    }) {
    return http.post('goods', {
      goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs
    })
  },
  //根据id查询商品
  getGoodsById({ id }: { id: number }) {
    return http.get(`goods/${id}`)
  },
  //编辑提交商品
  editGoods({ id, goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }:
    {
      id: number, goods_name: string, goods_price: number, goods_number: number, goods_weight: number
      , goods_introduce: string | null, pics: any | null, attrs: any | null
    }) {
    return http.put(`goods/${id}`, {
      goods_name, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs
    })
  },
  //删除商品
  delGoods({ id }: { id: number }) {
    return http.delete(`goods/${id}`)
  },
  //获取商品分类列表
  getCategories({ type, pagenum, pagesize }: { type?: number | null, pagenum?: number | null, pagesize?: number | null }) {
    let url = 'categories'
    if (type) {
      url += `?type=${type}`
      if (pagenum)
        url += `&pagenum=${pagenum}&pagesize=${pagesize}`
    }
    if (pagenum)
      url += `?pagenum=${pagenum}&pagesize=${pagesize}`
    return http.get(url)
  },
  //添加分类
  addCategory({ cat_pid, cat_name, cat_level }: { cat_pid: number, cat_name: string, cat_level: number }) {
    return http.post('categories', {
      cat_pid, cat_name, cat_level
    })
  },
  //编辑商品分类
  editCategory({ id, cat_name }: { id: number, cat_name: string }) {
    return http.put(`categories/${id}`, {
      cat_name
    })
  },
  //删除商品分类
  delCategory({ id }: { id: number }) {
    return http.delete(`categories/${id}`)
  },
  //根据id查询商品分类
  getCategoryById({ id }: { id: number }) {
    return http.get(`categories?id=${id}`)
  },
  //获取参数列表
  getAttributes({ id, sel }: { id: number, sel: string }) {
    return http.get(`categories/${id}/attributes?sel=${sel}`)
  },
  //删除参数
  delAttributes({ id, attrid }: { id: number, attrid: number }) {
    return http.delete(`categories/${id}/attributes/${attrid}`)
  },
  //添加动态参数或者静态属性
  addAttributes({ id, attr_name, attr_sel, attr_vals }: {
    id: number, attr_name: string, attr_sel: string, attr_vals: string
  }) {
    return http.post(`categories/${id}/attributes`, {
      attr_name, attr_sel, attr_vals
    })
  },
  //编辑提交参数
  editAttributes({ id, attrId, attr_name, attr_sel, attr_vals }: {
    id: number, attrId: number, attr_name: string, attr_sel: string, attr_vals: string
  }) {
    return http.put(`categories/${id}/attributes/${attrId}`, {
      attr_name, attr_sel, attr_vals
    })
  },
  // 根据 ID 查询参数
  getAttributesById({ id, attrId, attr_sel, attr_vals }: {
    id: number, attrId: number, attr_sel: string, attr_vals: string
  }) {
    return http.get(`categories/${id}/attributes/${attrId}?attr_sel=${attr_sel}&attr_vals=${attr_vals}`)
  },
  //添加/删除分类参数标签
  updateAttributesById({ id, attrId,attr_name, attr_sel, attr_vals }: {
    id: number, attrId: number, attr_name:string,attr_sel: string, attr_vals: string
  }) {
    return http.put(`categories/${id}/attributes/${attrId}`, { attr_name,attr_sel, attr_vals })
  },
  // //图片上传
  // upload({file}:{file:any}) {
  //   console.log(file);
  //   return http.post('upload',{file})
  // }
}