import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './components';
import { Input, Pagination, Typography, InputNumber, Button, MenuProps, Dropdown } from 'antd';

function Home() {
     const navigate = useNavigate();
     const [products, setProducts] = useState({})
     const [page, setPage] = useState(1)
     const [minCost, setMinCost] = useState(10000)
     const [maxCost, setMaxCost] = useState(100000)
     const [searchContent, setSearchContent] = useState("")
     const [searchType, setSearchType] = useState("NAME")
     const [searchTypeVisible, setSearchTypeVisible] = useState("Нэрээр")

     const validateToken = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://127.0.0.1:8080/api/auth?token=" + token;
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    fetchProducts();
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const fetchProducts = () => {
          const url = "http://127.0.0.1:8080/api/product/browse";
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    setProducts(response.data)
               }
          });
     }

     const fetchProductsWithArguments = () => {
          if(searchType.length == 0) {
               fetchProducts();
          } else {
               const pageOffset = (page - 1) * 12;
               var url;
               if(searchType === 'PRICE') {
                    url = "http://127.0.0.1:8080/api/product/browse?type=" + searchType + "&parameter=" + minCost + "_" + maxCost + "&pageSize=10&pageOffset=" + pageOffset;
               } else {
                    url = "http://127.0.0.1:8080/api/product/browse?type=" + searchType + "&parameter=" + searchContent + "&pageSize=10&pageOffset=" + pageOffset;
               }
               axios.get(url, {
                    headers: {
                         'Content-Type': 'application/json',
                    }
               })
               .then(response => {
                    if(response.status === 200) {
                         setProducts(response.data)
                    }
               });
          }
     }

     useEffect(() => {
          validateToken()
     }, [])
     
     const numberFormatter = (value) => {
          return `₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
     }

     const items = [
          {
            key: '1',
            label: (
               <Button type='link' onClick={() => {
                    setSearchType("NAME")
                    setSearchTypeVisible("Нэрээр")
               }}>Нэрээр</Button>
            ),
          },
          {
               key: '2',
               label: (
                  <Button type='link' onClick={() => {
                       setSearchType("MANUFACTURER")
                       setSearchTypeVisible("Үйлдвэрлэгчээр")
                  }}>Үйлдвэрлэгчээр</Button>
               ),
          },
          {
               key: '3',
               label: (
                  <Button type='link' onClick={() => {
                       setSearchType("CATEGORY")
                       setSearchTypeVisible("Төрлөөр")
                  }}>Төрлөөр</Button>
               ),
          },
          {
               key: '2',
               label: (
                  <Button type='link' onClick={() => {
                       setSearchType("PRICE")
                       setSearchTypeVisible("Үнээр")
                  }}>Үнээр</Button>
               ),
          }
        ];


  return (
    <div style={{
     display: 'flex',
     flexDirection: 'column',
     minHeight: '100vh',
     padding: '10px',
    }}>
          <div style={{display: 'flex', columnGap: '25px', alignItems: 'center'}}>
               <Typography>Хайлт: </Typography>
               <Dropdown menu={{ items }}>
                    <Button onClick={(e) => e.preventDefault()}>
                         {searchTypeVisible}
                    </Button>
               </Dropdown>
               <Input placeholder='Хайлтийн жишээ: Мотор' style={{width: '60vw'}} onSubmit={fetchProductsWithArguments} onChange={(e) => setSearchContent(e.target.value)}/>
               <Button onClick={fetchProductsWithArguments} type='primary'>Хайх</Button>
          </div>
          <Typography style={{marginTop: '25px'}}>Нийт {products?.size} илэрц олдлоо</Typography>
          <div style={{marginTop: '25px', display: 'flex'}}>
               <div style={{minWidth: '300px', minHeight: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Typography>Үнийн дээд ба доод хязгаар: </Typography>
                    <div style={{display: 'flex', columnGap: '10px'}}>
                         <InputNumber placeholder='Үнийн доод хязгаар' defaultValue={minCost} formatter={numberFormatter} disabled={searchType !== 'PRICE'}
                              onChange={(value) => setMinCost(value || 0)}/>
                         <Typography>-</Typography>
                         <InputNumber placeholder='Үнийн дээд хязгаар' defaultValue={maxCost} formatter={numberFormatter}  disabled={searchType != 'PRICE'}
                              onChange={(value) => setMaxCost(value || 0)}/>
                    </div>
                    <p>Test</p>
               </div>
               <div style={{display: 'flex', columnGap: '25px'}}>
                    {products?.products?.map((product, index) => {
                         return <ProductCard product={product} key={index}/>
                    })}
               </div>
          </div>
          <Pagination defaultCurrent={1} total={products?.size} style={{marginTop: '25px', width: '100vw', textAlign: 'center'}} onChange={setPage}/>
    </div>
  )
}

export default Home