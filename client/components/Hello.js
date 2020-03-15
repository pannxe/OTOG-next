import { useState, useEffect } from 'react'

import styled from 'styled-components'
import vars from '../styles/vars'

import CountUp from 'react-countup'
import { lighten } from 'polished'

const WelcomeText = styled.h4`
    color: ${vars.black};
    text-align: center;
`
const AliveText = styled.h6`
    color: ${vars.black};
    text-align: center;
    font-weight: bold;
`
const Number = styled(CountUp)`
    color: ${vars.white};
    font-family: Calibri;
    font-size: 50px;
    margin-top:-5px;
    font-weight:100;
    text-align: center;
`
const Message = styled.h5`
    color: ${vars.white};
    font-family: Calibri;
    font-size: 15px;
    margin-top:10px;
    margin-bottom:0px;
    font-weight:600;
    text-align: center;
`
const ButtonWrapper = styled.ul`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
`
const CountButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    background: ${props => lighten(0.05, props.color)};
    box-shadow: 0 5px ${vars.btn_gray};
    border-radius: 1rem;
    width: 128px;
    height: 95px;
    padding: 20px;
    margin: 6px 3px;
    transition: background-color 0.1s;
    &:hover {
        background: ${props => lighten(0.08, props.color)};
    }
    &:active {
        background: ${props => props.color};
        transform: translateY(3px);
        box-shadow: 0 2px ${vars.btn_gray};
    }
`

const Hello = (props) => {
    const [allProb,setallProb] = useState(0)
    const [passProb,setpassProb] = useState(0)
    const [wrongProb,setwrongProb] = useState(0)
    const [noSub,setnoSub] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            let url = `${process.env.API_URL}/api/countProblem`
            let headers = { "Content-Type": "application/json" }
            headers["Authorization"] = props.userData.id;
            const response = await fetch(url, { headers, })
            const js = await response.json()
            setallProb(js.allProblem)
            setpassProb(js.userProblem.passProb)
            setwrongProb(js.userProblem.wrongProb)
            setnoSub(js.allProblem-js.userProblem.passProb-js.userProblem.wrongProb)
        }
        fetchData()
    }, [])
    return (
        <>
            <WelcomeText>สวัสดี {props.userData.sname}</WelcomeText>
            <ButtonWrapper>
            {[  //message,  number,     color
                ['ทั้งหมด',   allProb,    vars.btn_black],
                ['ผ่านแล้ว',  passProb,   vars.btn_green],
                ['ยังไม่ผ่าน', wrongProb,  vars.btn_red],
                ['ยังไม่ส่ง',  noSub,      vars.btn_orng],
                ['โจทย์วันนี้', 0,          vars.btn_blue],
            ].map(([ message, number, color ], index) => (
                <CountButton {...{color}} key={index}>
                    <Message>{message}</Message>
                    <Number end={number}/>
                </CountButton>
            ))}
            </ButtonWrapper>
            <AliveText>ยังมีชีวิตรอด : {0}</AliveText>
        </>
    )
}
export default Hello