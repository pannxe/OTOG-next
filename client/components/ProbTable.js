import Link from 'next/link'
import Submit from './Submit'
import Popup from 'reactjs-popup'
import { isLogin } from '../utils/auth'
import { CustomTr, CustomTable } from './CustomTable'
import styled from 'styled-components'

const ProbTable = (props) => (
    <CustomTable>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passed</th>
                <th>Ratings</th>
                {isLogin(props.userData) && <th>Submit</th>}
            </tr>
        </thead>
        <tbody>
            <ProbData {...props}></ProbData>
        </tbody>
    </CustomTable>
)

const ProbData = ({ problems, userData }) => (
    problems === undefined ? null : problems.map(problem => {
        const { id_Prob, name, time, memory, sname, pass } = problem
        return (
            <CustomTr key={id_Prob} accept={false} wrong={false} >
                <td>{id_Prob}</td>
                <td><Link href="/problem/[name]" as={`/problem/${sname}`}>
                    <a>{name}<br />({time} วินาที {memory} MB)</a>
                </Link></td>
                <td><Popup trigger={<div>{pass ? pass.length : 0}</div>} position="left center">
                    <div>{pass === undefined ? '' :pass.map((item, i) => <div key={i}>{item}</div>)}</div>
                </Popup></td>
                <td>0</td>
                {isLogin(userData) && <td><Submit  {...problem} {...{userData}}></Submit></td>}
            </CustomTr>
        )
    })
)

export default ProbTable