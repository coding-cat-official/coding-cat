
import Tour from 'reactour'
import { Question } from '@phosphor-icons/react'
import { mutationPageTutorial } from '../utils/tutorials'

export default function Tutorial({tourState, setTourState}){

  return(
    <>
      <Question size={40} weight="fill" style={{cursor:'pointer', color:'#ffb564', minWidth:'50px'}} onClick={()=>{setTourState(true)}}>?</Question>
      <Tour
        steps={mutationPageTutorial}
        isOpen={tourState}
        onRequestClose={()=>{setTourState(false)}} 
        rounded={10}
      />
    </>
  )
}