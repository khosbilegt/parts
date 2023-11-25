import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, message } from 'antd'
import Typography from 'antd/es/typography/Typography'

function ProductCard(props) {
  const navigate = useNavigate();

  const addToCart = () => {
    const token = localStorage.getItem('parts-token');
    const url = 'http://127.0.0.1:8080/api/cart?token=' + token + "&productId=" + props.product.productID;
    axios.put(url, {}, {
      headers: {
           'Content-Type': 'application/json',
      }
    })
    .then(response => {
          if(response.status === 200) {
            message.success("Сагсанд амжилттай нэмэгдлээ")
          }
    })
    .catch(error => {
          if(error.response.data?.message === "TOKEN_INVALID") {
              navigate("/login")  
          }
    });
  }

  return (
    <Card title={props.product.productName} style={{width: '300px'}}>
      <Typography><span style={{fontWeight: 'bold'}}>Үйлдвэрлэгч:</span> {props.product.manufacturer}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Төрөл:</span> {props.product.category}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Үнэ:</span> {props.product.price}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Үлдэгдэл:</span> {props.product.stock}</Typography>
      <Button style={{marginTop: '10px'}} onClick={addToCart}>Сагсанд нэмэх</Button>
    </Card>
  )
}

export default ProductCard