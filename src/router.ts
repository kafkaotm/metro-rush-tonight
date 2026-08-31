import { createRouter, createWebHistory } from 'vue-router'
import linesData from './data/lines.json'
import stationsOfLineData from './data/stationsOfLine.json'
import { filterStationsByLine } from './logic/filterStationsByLine'
import type { Line, StationOfLine } from './logic/types'
import LinesPage from './pages/LinesPage.vue'
import ResultPage from './pages/ResultPage.vue'
import StationsPage from './pages/StationsPage.vue'

const lines = linesData as Line[]
const stationsOfLine = stationsOfLineData as StationOfLine[]

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LinesPage },
    {
      path: '/lines/:lineId',
      component: StationsPage,
      props: true,
      beforeEnter: (to) => {
        const exists = lines.some((line) => line.LineID === to.params.lineId)
        return exists ? true : '/'
      },
    },
    {
      path: '/lines/:lineId/stations/:stationId',
      component: ResultPage,
      props: true,
      beforeEnter: (to) => {
        const stations = filterStationsByLine(stationsOfLine, to.params.lineId as string)
        const exists = stations.some((station) => station.StationID === to.params.stationId)
        return exists ? true : `/lines/${to.params.lineId}`
      },
    },
  ],
})
