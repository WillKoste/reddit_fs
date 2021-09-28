import React from 'react'
import { Button } from '@chakra-ui/button'
import {History} from 'history'
import { Box } from '@chakra-ui/layout'

interface SplashProps {
  history: History
}

const Splash: React.FC<SplashProps> = ({history}) => {
  return (
    <Box display="flex" flexDir="column" alignItems="center" justifyContent="center" w="100%">
      <h1 style={{fontSize:'28px', margin:'2rem 0'}}>Welcome :D</h1>
    </Box>
  )
}

export default Splash
