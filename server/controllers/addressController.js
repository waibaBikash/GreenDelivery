

// Add Address: /api/address/add



export const addAddress = async (req, res) => {
  try {
    const { address, userId}= req.body;
    await Address.create({...address, userId});
    res.json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
}