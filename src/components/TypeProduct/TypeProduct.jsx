import React from 'react'
import { WrapperTypeProductText } from './style'
import { useNavigate } from 'react-router-dom'


const TypeProduct = ({name}) => {
  const navigate = useNavigate()
  const handleNavigateType = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
  }
  return (
    <WrapperTypeProductText onClick={() => handleNavigateType(name)}>
      {name}
    </WrapperTypeProductText>
  )
}

export default TypeProduct