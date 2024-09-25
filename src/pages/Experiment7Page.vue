<template>
  <v-container class="d-flex h-100 w-100 align-center justify-center">
    <v-card :elevation="8" class="mx-auto w-100">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar color="primary" size="24" v-text="step"></v-avatar>
      </v-card-title>

      <v-window v-model="step">
        <v-window-item :value="0">
          <v-card-text>
            <v-row>
              <span>初始剂量率：{{ originalRate }}</span>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="origin"
                  variant="outlined"
                  label="本源"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="offset"
                  variant="outlined"
                  label="本底"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn prepend-icon="mdi-update" @click="updateOriginalRate()"
              >更新数据</v-btn
            >
          </v-card-text>
        </v-window-item>
        <v-window-item v-for="(da, index) in data" :value="index + 1">
          <v-card-text>
            <v-data-table-virtual
              :headers="headers"
              :items="da.item"
              :height="200"
            ></v-data-table-virtual>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="x"
                  variant="outlined"
                  label="厚度"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="y"
                  variant="outlined"
                  label="测量剂量率"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-around" style="margin-bottom: 4px">
              <v-btn
                prepend-icon="mdi-data-matrix-minus"
                :elevation="1"
                @click="deleteLastData(index)"
                >删除最新数据</v-btn
              >
              <v-btn
                prepend-icon="mdi-data-matrix-plus"
                :elevation="1"
                @click="addData(index)"
                >添加数据</v-btn
              >
            </v-row>
          </v-card-text>
        </v-window-item>
        <v-window-item :value="6">
          <v-card-text>
            <v-sheet>
              <Chart
                type="line"
                ref="chartRef"
                :data="chartData"
                :options="options"
              ></Chart>
            </v-sheet>
          </v-card-text>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if="step > 0" variant="text" @click="step--"> Back </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 5" color="primary" variant="flat" @click="step++">
          Next
        </v-btn>
        <v-btn
          v-if="step == 5"
          color="primary"
          variant="flat"
          @click="onHandleData()"
        >
          Next
        </v-btn>
        <v-btn
          v-if="step == 6"
          color="primary"
          variant="flat"
          @click="downloadChart()"
          >Download</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar color="errorContainer" v-model="snackbar" :timeout="2000">
      <span> 请先更新本底和本源 </span>
      <template #actions>
        <v-btn
          color="onErrorContainer"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ChartData,
  Point,
  ChartOptions,
  Colors,
} from 'chart.js'
import { Chart } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  {
    id: 'whiteBackground',
    beforeDraw: (chart: ChartJS) => {
      const ctx = chart.ctx
      ctx.save()
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, chart.width, chart.height)
      ctx.restore()
    },
  }
)

interface DataList {
  item: Point[]
}

const step = ref<number>(0)
const titleList = ['混凝土', '铁', '铅', '聚乙烯', '瓷砖', '图例']

const currentTitle = computed(() => {
  return titleList[step.value - 1]
})

const headers = [
  { title: '厚度/mm', key: 'x' },
  { title: '测量剂量率', key: 'y' },
]

const x = ref<number | null>(null)
const y = ref<number | null>(null)

const origin = ref<number>(0)
const offset = ref<number>(0)
const originalRate = ref<number>(0)

function updateOriginalRate() {
  originalRate.value = Number(origin.value) - Number(offset.value)
  origin.value = 0
  offset.value = 0
}

const data = ref<DataList[]>([
  { item: [] },
  { item: [] },
  { item: [] },
  { item: [] },
  { item: [] },
])

function addData(step: number) {
  data.value[step].item.push({ x: Number(x.value), y: Number(y.value) })
  x.value = null
  y.value = null
}

function deleteLastData(step: number) {
  data.value[step].item.pop()
}

const chartData = computed<ChartData<'line', Point[]>>(() => {
  return {
    datasets: data.value.map((dataList, index) => {
      return {
        label: titleList[index],
        type: 'line',
        data: dataList.item,
        borderWidth: 1,
      }
    }),
  }
})
const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      title: {
        display: true,
        text: '透射比曲线图',
        padding: { top: 12 },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '厚度/mm',
      },
      type: 'linear',
      position: 'bottom',
    },
    y: {
      title: {
        display: true,
        text: '透射比',
      },
    },
  },
}
const snackbar = ref<boolean>(false)

async function onHandleData() {
  if (originalRate.value == 0) {
    step.value = 0
    snackbar.value = true
  } else {
    data.value.forEach((l) => {
      l.item.forEach((d) => {
        d.y /= originalRate.value
      })
    })
    step.value++
  }
}

const chartRef = ref<InstanceType<typeof Chart> | null>(null)

function downloadChart() {
  if (chartRef.value) {
    //创建下载链接
    const link = document.createElement('a')
    link.href = (chartRef.value.chart as ChartJS).toBase64Image()
    link.download = '投射比曲线图.png'
    link.click()
  }
}
</script>

<style scoped></style>
