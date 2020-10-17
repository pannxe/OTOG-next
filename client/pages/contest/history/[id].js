import { Title, Name } from '../../../components/CustomText'
import PageLayout from '../../../components/PageLayout'
import OrangeButton from '../../../components/OrangeButton'
import {
  CustomTable,
  TableRow,
  UserTd,
  TableData,
} from '../../../components/CustomTable'

import { faChartArea } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useGet } from '../../../utils/api'

const ScoreTr = (props) => {
  const { rank, sname, sumTime, sum, scores, tasks, rating, idUser } = props
  const maxSum = tasks.reduce((total, prob) => total + prob.score, 0)
  const score = (prob) =>
    scores[prob.id_Prob] ? scores[prob.id_Prob].score : 0
  const round = (num) => Math.round(num * 100) / 100

  return (
    <TableRow acceptState={sum === maxSum}>
      <td>{rank}</td>
      <td>
        <Name {...{ rating, sname, idUser }} />
      </td>
      {tasks.map((prob, index) => (
        <TableData
          key={index}
          acceptState={prob.score === score(prob)}
          wrongState={scores[prob.id_Prob] && prob.score !== score(prob)}
        >
          {round(score(prob))}
        </TableData>
      ))}
      <td>{round(sum)}</td>
      <td>{round(sumTime)}</td>
    </TableRow>
  )
}

const Scoreboard = ({ tasks, contestants }) => {
  return (
    <CustomTable ready={!!tasks && !!contestants}>
      <thead>
        <tr>
          <th>#</th>
          <th>ชื่อผู้เข้าแข่งขัน</th>
          {tasks?.map((n, i) => (
            <th key={i} title={n.name}>
              ข้อที่ {i + 1}
            </th>
          ))}
          <th>คะแนนรวม</th>
          <th>เวลารวม</th>
        </tr>
      </thead>
      <tbody>
        {contestants?.map((con, index) => (
          <ScoreTr key={index} tasks={tasks} {...con} />
        ))}
      </tbody>
    </CustomTable>
  )
}

const ContestScoreboard = (props) => {
  const router = useRouter()
  const { id } = router.query
  const {
    data: { contestants },
  } = useGet(`/api/contest/history/${id}`)
  const {
    data: { tasks },
  } = useGet(`/api/contest/${id}`)

  return (
    <PageLayout>
      <Title icon={faChartArea} noBot='true' text={`Scoreboard #${id}`}>
        <OrangeButton href='/contest/history'>View Contest</OrangeButton>
      </Title>
      <hr />
      <Scoreboard contestants={contestants} tasks={tasks} />
    </PageLayout>
  )
}

export default ContestScoreboard
