<template>
  <el-card class="wbfb">
    <div id="main" class="wbfb" style="height:400px"></div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from "vue";
import api from "@/http/api";
export default defineComponent({
  setup() {
    //声明变量开始
    let echarts = ref<any>(inject("ec")); //引入
    //声明变量结束
    // 声明方法开始
    // 声明方法结束
    let reports = () => {
      api
        .getReports()
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 200) {
            let myChart = echarts.value.init(document.getElementById("main"));
            // myChart.setOption(data)
            // 绘制图表
            myChart.setOption({
              color: ["#d4716e", "#6d7c87", "#90bcc2", "#e1a793", "#b2d8c6"],
              title: {
                text: ""
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985"
                  },
                  borderRadius: 10
                },
                show: false
              },
              legend: {
                data: res.legend
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  // boundaryGap: false,
                  data: res.data.xAxis[0].data,
                  //y轴示坐标轴轴线
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: "#000" //y轴坐标颜色
                    }
                  },
                  //y轴刻度标签数字
                  axisLabel: {
                    interval: "auto",
                    textStyle: {
                      color: "#000", //y轴标签颜色
                      textAlign: "center"
                    }
                  },
                  //y轴刻度
                  axisTick: { show: true }
                }
              ],
              yAxis: [
                {
                  type: "value",
                  //y轴示坐标轴轴线
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: "#000" //y轴坐标颜色
                    }
                  },
                  //y轴刻度标签数字
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: "#000" //y轴标签颜色
                    }
                  },
                  //y轴刻度
                  axisTick: { show: true }
                }
              ],
              series: res.data.series
            });
            window.onresize = function() {
              //自适应大小
              myChart.resize();
            };
          }
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //页面加载
    onMounted(() => {
      reports();
    });
    return {};
  }
});
</script>

<style scoped>
</style>