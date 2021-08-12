<template>
  <el-card class="wbfb">
    <div class="f-a-c">
      <el-input
        placeholder="请输入搜索内容"
        v-model="search"
        class="input-with-select m-r20 ipt-d"
        :clearable="true"
      >
        <template #append>
          <el-button icon="el-icon-search" @click="select"></el-button>
        </template>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      border
      class="m-t20"
    >
      <el-table-column label="#" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column label="订单编号" prop="order_number" align="center">
      </el-table-column>
      <el-table-column label="订单价格" prop="order_price" align="center">
      </el-table-column>
      <el-table-column label="是否付款" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.order_pay === '1'"
            >已付款</el-tag
          >
          <el-tag type="danger" v-if="scope.row.order_pay === '0'"
            >未付款</el-tag
          >
          <el-tag type="warning" v-else>收货中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send" align="center">
      </el-table-column>
      <el-table-column label="下单时间" prop="time" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location-outline"
            size="mini"
            @click="showwl"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 15, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </el-card>
  <el-dialog title="编辑地址" v-model="show" width="40%">
    <el-cascader
      v-model="value"
      :options="options"
      @change="handleChange"
    ></el-cascader>
  </el-dialog>
  <el-dialog title="物流信息" v-model="kdShow" width="50%">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in logistics"
        :timestamp="activity.time"
        class="p-r"
      >
      <div class="yq yd bc-w f-s12 f-j-c a-c">{{index+1}}</div>
      <div :class="{'f-c-9':index!=0}">
          {{ activity.context }}
      </div>
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import area from "@/lib/area";
//订单接口
interface obj {
  consignee_addr: string;
  create_time: number;
  is_send: string;
  order_fapiao_company: string;
  order_fapiao_content: string;
  order_fapiao_title: string;
  order_id: number;
  order_pay: string;
  order_price: number;
  pay_status: string;
  trade_no: string;
  update_time: number;
  user_id: number;
  time: string;
}
//物流接口
interface wlObj {
  context: string;
  time: string;
}
export default defineComponent({
  setup() {
    // 声明变量开始
    let value = ref<string>("");
    let options = ref<any>([]);
    //搜索内容
    let search = ref<string>("");
    //订单数据
    let tableData = ref<obj[]>([]);
    //修改地址弹框是否显示
    let show = ref<boolean>(false);
    //物流弹框是否显示
    let kdShow = ref<boolean>(false);
    //物流数据
    let logistics = ref<wlObj[]>([]);
    //当前页码
    let pagenum = ref<number>(1);
    //每页显示条数
    let pagesize = ref<number>(5);
    //用户总条数
    let total = ref<number>(0);
    // 声明变量结束
    // 声明方法开始
    //获取城市列表
    let getCity = () => {
      let province_list = area.province_list as any;
      let city_list = area.city_list as any;
      let county_list = area.county_list as any;
      Object.keys(province_list).map(item => {
        //市区
        let proArr = ref<any>([]);
        Object.keys(city_list).map(item1 => {
          if (item.substr(0, 2) === item1.substr(0, 2)) {
            //城市
            let cityArr = ref<any>([]);
            Object.keys(county_list).map(item2 => {
              if (item1.substr(0, 4) === item2.substr(0, 4)) {
                cityArr.value.push({
                  value: item2,
                  label: county_list[item2]
                });
              }
            });
            let obj1 = {
              value: item1,
              label: city_list[item1],
              children: cityArr
            };
            proArr.value.push(obj1);
          }
        });
        //省份
        let obj = {
          value: item,
          label: province_list[item],
          children: proArr
        };
        options.value.push(obj);
      });
    };
    //搜索
    const select = () => {
      getOrders();
    };
    //获取订单数据
    const getOrders = () => {
      api
        .getOrdes({
          query: search.value,
          pagenum: pagenum.value,
          pagesize: pagesize.value,
          user_id: undefined,
          pay_status: undefined,
          is_send: undefined,
          order_fapiao_title: "",
          order_fapiao_company: "",
          order_fapiao_content: "",
          consignee_addr: ""
        })
        .then((res: any) => {
          //  console.log(res);
          if (res.meta.status === 200) {
            tableData.value = res.data.goods;
            total.value = res.data.total;
            tableData.value.map((item: obj) => {
              item.time = dayjs(item.create_time).format("YYYY-MM-DD HH-mm-ss");
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //切换页码
    const handleCurrentChange = (val: number) => {
      pagenum.value = val;
      getOrders();
    };
    //切换每页显示条数
    const handleSizeChange = (val: number) => {
      pagesize.value = val;
      getOrders();
    };
    //查看物流信息
    const showwl = () => {
      kdShow.value = true;
      // 804909574412544600 1106975712662
      api
        .kuaidi({
          id: 804909574412544600
        })
        .then((res: any) => {
          // console.log(res);
          if (res.data.meta.status === 200) {
            logistics.value = res.data.data;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    const handleChange = (value: string) => {
      console.log(value);
    };
    //编辑订单
    const edit = () => {
      show.value = true;
    };
    // 声明方法结束
    // 页面加载
    onMounted(() => {
      getOrders();
      getCity();
    });
    return {
      tableData,
      show,
      kdShow,
      search,
      pagesize,
      pagenum,
      handleSizeChange,
      handleCurrentChange,
      total,
      select,
      showwl,
      edit,
      options,
      handleChange,
      value,
      logistics
    };
  }
});
</script>

<style scoped>
.ipt-d {
  width: 300px;
}
.el-select {
  width: 100% !important;
}
.yq {
  position: absolute;
  left: -5px;
  width: 20px;
  height: 20px;
  top: 0;
  border: 1px solid #ccc;
}
</style>