import React, { useEffect } from 'react'
import { Card } from 'antd'
import Typography from 'antd/es/typography/Typography'

function ProductCard(props) {

  useEffect(() => {
  }, [])


  //{props.product.productID}

  return (
    <Card title={props.product.productName} style={{width: '300px'}}>
      <Typography><span style={{fontWeight: 'bold'}}>Үйлдвэрлэгч:</span> {props.product.manufacturer}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Төрөл:</span> {props.product.category}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Үнэ:</span> {props.product.price}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Үлдэгдэл:</span> {props.product.stock}</Typography>
    </Card>
  )
}

export default ProductCard