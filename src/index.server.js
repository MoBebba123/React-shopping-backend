const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const app = express();
const database = require("./database/database");
const cookiesParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

// Routes imports
const userRoute = require("./routes/user");
const merchantRouter = require("./routes/merchant");
const itemRouter = require("./routes/merchantItem");
const category = require("./routes/itemCategory");
// connection database
database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(cookiesParser());
app.use(cors());
// Routes
app.use("/api", userRoute);
app.use("/api", merchantRouter);
app.use("/api", itemRouter);
app.use("/api", category);
cloudinary.config({
  cloud_name: "dkyyqvbna",
  api_key: "368228333932484",
  api_secret: process.env.API_SECRET,
});

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });
//app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  console.log(`server is running on Port ${process.env.PORT}`);
});

// const description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'

// async function create() {

//   const merchant = await Merchant.findOne({name: 'German Doner Kebab'})
//   console.log(merchant)

//   const item = await new MerchantItem({
//       merchantId: merchant._id,
//       name: 'GDK Box',
//       photo: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/11/5f/94/original-german-doner.jpg',
//       price: 9.49,
//       calories: Math.floor(Math.random() * 3000),
//       description,
//       steps: [
//          new MultiChoiceItemStep({
//             name: 'Choose Sauce',
//             required: true,
//             minNumberOfChoices: 1,
//             maxNumberOfChoices: 1,
//             options: [
//                new StepOption({ name: 'Mayo', isFree: true }),
//                new StepOption({ name: 'Ketchup', isFree: true }),
//                new StepOption({ name: 'Garlic Sauce', isFree: true }),
//                new StepOption({ name: 'GDK Signature Sauce', isFree: true }),
//             ],
//           },
//         ),
//          new SingleChoiceItemStep({
//             name: 'Choose a Drink',
//             required: true,
//             options: [
//                new StepOption({ name: 'Coca Cola', isFree: true}),
//                new StepOption({ name: 'Pepsi', isFree: true }),
//                new StepOption({ name: 'Dr. Pepper', isFree: true }),
//             ],
//           },
//         ),
//          new MultiChoiceItemStep({
//             name: 'Extras',
//             required: false,
//             minNumberOfChoices: 0,
//             maxNumberOfChoices: 1,
//             options: [
//                new StepOption({ name: 'Chicken Rolls x2', isFree: false, price: 2.49 }),
//                new StepOption({ name: 'Beef Rolls x2', isFree: true, price: 2.49 }),
//                new StepOption({ name: 'Mixed Rolls x2', isFree: true, price: 2.49 }),
//             ],
//           },
//         ),
//       ],
//     },
//   ).save()
//   await  ItemGroup.findOneAndUpdate({merchantId: merchant._id}, {$push: {itemIds: item._id}})
//    await new ItemGroup({merchantId: merchant._id, name: 'Kebabs'}).save()

// }

// create()

// const merchant =  new Merchant({
//   name: 'German Doner Kebab',
//   hero: 'https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_fill,f_auto,q_auto,w_1200,h_630,d_uk:cuisines:turkish-9.jpg/v1/uk/restaurants/81159.jpg',
//   category: 'Kebab',
//   rating: 4.0,
//   orders: 2679,
//   addressLine1: 'random address 123',
//   addressLine2: 'random 2 24165',
//   postcode: 'asdadacx',
//   longitude: 3.5178,
//   latitude: -1.9514,
// });

// merchant.save()
