import React from 'react'
import ProductsCart from './ProductsCart'

const BestSeller = () => {
  return (
    <div className='mt-16'>
       <p className='text-2xl md:text-3xl font-medium'>Best Seller</p>
        <div>
          <ProductsCart/>
        </div>
    </div>
  )
}

export default BestSeller