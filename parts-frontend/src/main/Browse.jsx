import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import { FooterComponent, ProductCard, TopBar } from './components';
import { Input, Pagination, Typography, InputNumber, Button, Dropdown, Skeleton } from 'antd';

function Browse() {
     const navigate = useNavigate();
     const location = useLocation()
     const [user, setUser] = useState({})
     const [products, setProducts] = useState({})
     const [page, setPage] = useState(1)
     const [minCost, setMinCost] = useState(10000)
     const [maxCost, setMaxCost] = useState(100000)
     const [searchContent, setSearchContent] = useState("")
     const [searchType, setSearchType] = useState("NAME")
     const [searchTypeVisible, setSearchTypeVisible] = useState("Нэрээр")
     const [isLoading, setLoading] = useState(true)

     const validateToken = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/auth?token=" + token;
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    setUser(response.data.user);
                    if(location?.search?.length > 0) {
                         const params = new URLSearchParams(location?.search);
                         const type = params.get("type");
                         const parameter = params.get("parameter");
                         setSearchType(type)
                         setSearchContent(parameter)
                         fetchProductsWithArgumentsFromValidation(type, parameter)
                    } else {
                         fetchProducts();
                    }
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const fetchProducts = () => {
          const url = "http://5.161.118.247:8089/api/product/browse";
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    setProducts(response.data)
                    setLoading(false)
               }
          });
     }

     const fetchProductsWithArgumentsFromValidation = (type, parameter) => {
          if(searchType.length === 0) {
               fetchProducts();
          } else {
               const pageOffset = (page - 1) * 12;
               var url = "http://5.161.118.247:8089/api/product/browse?type=" + type + "&parameter=" + parameter + "&pageSize=10&pageOffset=" + pageOffset;
               axios.get(url, {
                    headers: {
                         'Content-Type': 'application/json',
                    }
               })
               .then(response => {
                    if(response.status === 200) {
                         setProducts(response.data)
                         setLoading(false)
                    }
               });
          }
     }

     const fetchProductsWithArguments = () => {
          if(searchType.length === 0) {
               fetchProducts();
          } else {
               const pageOffset = (page - 1) * 12;
               var url;
               if(searchType === 'PRICE') {
                    url = "http://5.161.118.247:8089/api/product/browse?type=" + searchType + "&parameter=" + minCost + "_" + maxCost + "&pageSize=10&pageOffset=" + pageOffset;
               } else {
                    url = "http://5.161.118.247:8089/api/product/browse?type=" + searchType + "&parameter=" + searchContent + "&pageSize=10&pageOffset=" + pageOffset;
               }
               axios.get(url, {
                    headers: {
                         'Content-Type': 'application/json',
                    }
               })
               .then(response => {
                    if(response.status === 200) {
                         setProducts(response.data)
                         setLoading(false)
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

     const searchTypeItems = [
          {
            key: '1',
            label: (
               <Button type='text' style={{width: '100%'}} onClick={() => {
                    setSearchType("NAME")
                    setSearchTypeVisible("Нэрээр")
               }}>Нэрээр</Button>
            ),
          },
          {
               key: '2',
               label: (
                    <Button type='text' style={{width: '100%'}} onClick={() => {
                       setSearchType("MANUFACTURER")
                       setSearchTypeVisible("Үйлдвэрлэгчээр")
                  }}>Үйлдвэрлэгчээр</Button>
               ),
          },
          {
               key: '3',
               label: (
                    <Button type='text' style={{width: '100%'}} onClick={() => {
                       setSearchType("CATEGORY")
                       setSearchTypeVisible("Төрлөөр")
                  }}>Төрлөөр</Button>
               ),
          },
          {
               key: '4',
               label: (
                  <Button type='text' style={{width: '100%'}} onClick={() => {
                       setSearchType("PRICE")
                       setSearchTypeVisible("Үнээр")
                  }}>Үнээр</Button>
               ),
          }
        ];

  return (
     <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh'}}>
          <TopBar user={user} selected={'/browse'}/>
          <div style={{display: 'flex', columnGap: '25px', alignItems: 'center', justifyContent: 'center', width: '80%'}}>
               <Typography style={{minWidth: '50px'}} >Хайлт: </Typography>
               <Dropdown menu={{ items: searchTypeItems }}>
                    <Button onClick={(e) => e.preventDefault()}>
                         {searchTypeVisible}
                    </Button>
               </Dropdown>
               {searchType === 'PRICE' ? ( 
                    <div style={{display: 'flex', columnGap: '10px'}}>
                         <InputNumber placeholder='Үнийн доод хязгаар' defaultValue={minCost} formatter={numberFormatter} disabled={searchType !== 'PRICE'}
                              onChange={(value) => setMinCost(value || 0)}/>
                         <Typography>-</Typography>
                         <InputNumber placeholder='Үнийн дээд хязгаар' defaultValue={maxCost} formatter={numberFormatter}  disabled={searchType !== 'PRICE'}
                              onChange={(value) => setMaxCost(value || 0)}/>
                    </div>
               ) 
               : ( 
                    <Input placeholder='Хайлтийн жишээ: Мотор' style={{width: '50vw'}} onSubmit={fetchProductsWithArguments} onChange={(e) => setSearchContent(e.target.value)}/>
               )}
               <Button onClick={fetchProductsWithArguments} type='primary'>Хайх</Button>
          </div>
          <Skeleton loading={isLoading} style={{marginTop: '25px', display: 'flex', width: '95vw', marginLeft: '2.5vw'}}>
               <Typography style={{marginTop: '25px'}}>Нийт {products?.size} илэрц олдлоо</Typography>
               <div style={{marginTop: '25px', display: 'flex', width: '95vw', marginLeft: '2.5vw'}}>
                    <div style={{display: 'flex', columnGap: '25px', width: '100%', justifyContent: 'center'}}>
                              {products?.products?.map((product, index) => {
                                   return <ProductCard product={product} key={index} onAdded={fetchProductsWithArguments}/>
                              })}
                    </div>
               </div>
          </Skeleton>
          <Pagination defaultCurrent={1} total={products?.size} style={{marginTop: '25px', width: '100vw', textAlign: 'center'}} onChange={setPage}/>
          <FooterComponent />
    </div>
  )
}

export default Browse