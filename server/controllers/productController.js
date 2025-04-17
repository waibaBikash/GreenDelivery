import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
// Add Product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
   
    const images = req.files;

    let imgagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url
      })
    );
    await Product.create({
      ...productData,
      images: imgagesUrl,
    });
    res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
}

// Get Product: /api/product/list

export const productList = async (req, res) => {

}

// Get single product: /api/product/id
export const getProduct = async (req, res) => {

}

// Change product inStock: /api/product/stock
export const changeStock = async (req, res) => {

}
