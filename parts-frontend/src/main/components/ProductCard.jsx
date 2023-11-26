import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, message } from 'antd'
import Typography from 'antd/es/typography/Typography'
import { Placehodler } from '../../resources/images';
import { useState, useEffect } from 'react';

function ProductCard(props) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);

  const addToCart = () => {
    const token = localStorage.getItem('parts-token');
    const url = 'http://5.161.118.247:8089/api/cart?token=' + token + "&productId=" + props.product.productID;
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

  useEffect(() => {
    // Decode the Base64 string
    const decodedImage = atob(props.product?.image);

    // Create a Uint8Array from the decoded string
    const uint8Array = new Uint8Array(decodedImage.length);
    for (let i = 0; i < decodedImage.length; i++) {
      uint8Array[i] = decodedImage.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });

    // Create a data URL from the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Set the data URL as the image source
    setImageSrc(blobUrl);

    // Clean up the URL when the component unmounts
    return () => URL.revokeObjectURL(blobUrl);
  }, []);

  return (
    <Card title={props.product.productName} style={{width: '300px'}}>
      <div style={{width: '100%'}}>
        {props.product.image == null ? (
          <img src={Placehodler} style={{width: '75%', marginLeft: '12.5%'}}/>
        ) : (
          <img src={imageSrc} style={{width: '75%', marginLeft: '12.5%'}}/>
        )}
      </div>
      <Typography><span style={{fontWeight: 'bold'}}>Үйлдвэрлэгч:</span> {props.product.manufacturer}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Төрөл:</span> {props.product.category}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Үнэ:</span> {props.product.price}</Typography>
      <Typography><span style={{fontWeight: 'bold'}}>Үлдэгдэл:</span> {props.product.stock}</Typography>
      <Button style={{marginTop: '10px'}} onClick={addToCart}>Сагсанд нэмэх</Button>
    </Card>
  )
}

export default ProductCard