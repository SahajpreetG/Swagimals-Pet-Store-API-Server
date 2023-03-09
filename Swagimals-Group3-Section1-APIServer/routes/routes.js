const express = require("express");

const router = express.Router();

const { OAuth2Client } = require("google-auth-library");

module.exports = router;

// require json web token
const jwt = require("jsonwebtoken");

let DB = [];

//Model Imports
const userModel = require("../models/userModel");
const serviceModel = require("../models/servicesModel");
const blogModel = require("../models/blogModel");
const categoryModel = require("../models/categoryModel");
const petModel = require("../models/petModel");
const productModel = require("../models/productModel");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

//verify JWT
async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

//Signup route
router.post("/signup", async (req, res) => {
  console.log("in signup with req body =>", req.body);
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);

      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      DB.push(profile);

      res.status(201).json({
        message: "Signup was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message + "An error occurred. Registration failed.",
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      const existsInDB = DB.find((person) => person?.email === profile?.email);

      if (!existsInDB) {
        return res.status(400).json({
          message: "You are not registered. Please sign up",
        });
      }

      res.status(201).json({
        message: "Login was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

// For login and signup end

router.get("/", (req, res) => {
  console.log("in get");
  res.send("Get basic ");
});
//Post method
router.post("/addUser", async (req, res) => {
  console.log("request = ", req.body);
  const data = new userModel({
    userName: req.body.userData.userName,
    firstName: req.body.userData.firstName,
    userPswd: req.body.userData.hashedPswd,
    userRole: req.body.userData.userRole,
    isUserActive: req.body.userData.isUserActive,
    userRole: 0,
    isUserActive: 1,
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/addCategory", async (req, res) => {
  console.log("request = ", req.body);
  const data = new categoryModel({
    categoryName: req.body.categoryData.categoryName,
    categoryPet: req.body.categoryData.categoryPet,
    categoryImage: req.body.categoryData.categoryImage,
    categoryBanner: req.body.categoryData.categoryBanner,
    categoryDesc: req.body.categoryData.categoryDesc,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/addPet", async (req, res) => {
  console.log("request = ", req.body);
  const data = new petModel({
    // petName: req.body.petData.petName,
    // petPrice: req.body.petData.petPrice,
    petBreed: req.body.petData.petBreed,
    petImage: req.body.petData.petImage,
    petRating: req.body.petData.petRating,
    petType: req.body.petData.petType,
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/addProduct", async (req, res) => {
  console.log("request = ", req.body);
  const data = new productModel({
    productName: req.body.productData.productName,
    productRating: req.body.productData.productRating,
    productDesc: req.body.productData.productDesc,
    productImage: req.body.productData.productImage,
    productPrice: req.body.productData.productPrice,
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.route("/UpdateCategory").post(async (req, res) => {
  console.log('======================================== jas')
  console.log("update request = ", req.body);

  let catData = req.body.data;

  let id = catData._id;
  try {
    const data = await categoryModel.findOneAndUpdate(
      {_id:id},
      {
        categoryName:catData.categoryName,
        categoryPet:catData.categoryPet,
        categoryImage:catData.categoryImage,
        categoryBanner:catData.categoryBanner,
        categoryDesc:catData.categoryDesc,
      }
    )
    .then((resl)=> {
      res.status(200).json({message:`Record updated ${id}`});
    }).catch ((error) =>{
    console.log('In cath of try ', error)
    res.status(400).json({ message: error.message });
  });
}
catch(err){
  console.log(error)  
}
});
// GET method for fetching all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET method for fetching one category table row values
router.get("/formValues/:id", async (req, res) => {
  try {
    const updateCategory = await categoryModel.findById(req.params.id);
    res.status(200).json(updateCategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//ADMIN
//get for fetching all pets inside datatable
router.get("/pets", async (req, res) => {
  try {
    const pets = await petModel.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//get for fetching all products inside datatable
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET method for fetching all services
router.get("/services", async (req, res) => {
  try {
    const services = await serviceModel.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// GET method for fetching all blogs
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//POST Add service

router.post("/addServices", async (req, res) => {
  console.log("in addService");
  const data = new serviceModel({
    serviceName: req.body.ServiceData.serviceName,
    serviceType: req.body.ServiceData.serviceType,
    description: req.body.ServiceData.description,
    serviceImg: req.body.ServiceData.serviceImg,
    id: new Date(),
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
    console.log("service added");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//POST Add blogs

router.post("/addBlogs", async (req, res) => {
  const data = new blogModel({
    Title: req.body.BlogsData.Title,
    Content: req.body.BlogsData.Content,
    Image: req.body.BlogsData.Image,
  });

  try {
    const dataToSave = data.save();
    res.status(200).json(dataToSave);
    console.log("blog added");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", (req, res) => {
  res.send("Get basic ");
});

//Get all Method
router.get("/getAll", (req, res) => {
  res.send("Get All API");
});

//Get by ID Method
router.get("/getOne/:id", (req, res) => {
  res.send(req.params.id);
});

//Update by ID Method
router.patch("/update/:id", (req, res) => {
  res.send("Update by ID API");
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  res.send("Delete by ID API");
});

// Delete a category
router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json(deletedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});
//delete a pet
router.delete("/deletePet/:id", async (req, res) => {
  try {
    const deletedPet = await petModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedPet);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//delete a product
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});
//delete a service
router.delete("/deleteService/:id", async (req, res) => {
  try {
    const deletedService = await serviceModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedService);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});
//delete a blog
router.delete("/deleteBlog/:id", async (req, res) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedBlog);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//Get by ID Method
router.get("/GetServices", (req, res) => {
  //res.send('Here are the services...');

  serviceModel.find({}, (error, services) => {
    res.status(200).json({
      message: "Getservice successful",
      serviceData: services,
    });
  });
});

router.get("/GetBlog", (req, res) => {
  blogModel
    .find({})
    .then((pets) => res.json(pets))
    .catch((err) => console.log(err));
});

//Customer UI
// ------- Getting All Pets ---------------
router.get("/getPets", (req, res) => {
  petModel
    .find({})
    .then((pets) => res.json(pets))
    .catch((err) => console.log(err));
});

// ------- Getting All Product Categories ---------------
router.get("/getCategories", (req, res) => {
  categoryModel
    .find({})
    .then((categories) => res.json(categories))
    .catch((err) => console.log(err));
});

// ------- Getting All Product ---------------
// router.get("/getProducts", (req, res) => {
//   let petType = req.petType;

//   productModel
//     .find({petType})
//     .then((products) => res.json(products))
//     .catch((err) => console.log(err));
// });

//Customer API only
router.get("/getProduct", (req, res) => {
  productModel
    .find({})
    .then((products) => res.json(products))
    .catch((err) => console.log(err));
});
