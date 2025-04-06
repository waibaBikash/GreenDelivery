import React from 'react'
import ProductsCart from './ProductsCart'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
 const {products} = useAppContext();

  return (
    <div className='mt-16'>
       <p className='text-2xl md:text-3xl font-medium'>Best Seller</p>
        <div>
          <ProductsCart product={products[0]}/>
        </div>
    </div>
  )
}

export default BestSeller