const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp')
    .then(() => console.log("CONNECTION OPEN!"))
    .catch(err => console.log("Connection Error:", err));

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number }, 
    onSale: { type: Boolean, default: false },
    categories: [String],
    qty: {
        online: { type: Number, default: 0 },
        inStore: { type: Number, default: 0 }
    },
    size: { type: String, enum: ['S', 'M', 'L'] }
});

// Defining an Instance method
productSchema.methods.greet = function() {
    console.log(` ${this.name} is available`);
};

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save();
}

// Make a Model based on productSchema
const Product = mongoose.model('Product', productSchema);

const bicycles = [
    { name: "Mountain Bike Pro", price: 899.99, categories: ["mountain", "off-road"], size: "M" },
    { name: "City Commuter Bike", price: 459.50, categories: ["urban", "commuter"], size: "L" },
    { name: "Kids' Bicycle", price: 129.99, categories: ["kids", "beginner"], size: "S" },
    { name: "Road Racing Bike", price: 1200.00, categories: ["road", "racing"], size: "L" },
    { name: "Folding Electric Bike", price: 1500.00, categories: ["electric", "portable"], size: "M" },
    { name: "BMX Freestyle Bike", price: 349.99, categories: ["BMX", "freestyle"], size: "S" }
];

// Async/await for seeding
const seedAndFind = async () => {
    try {
        // 1. Insert bikes
        await Product.insertMany(bicycles);
        console.log("Bicycles added successfully!");

        // 2. Now query (guaranteed to run AFTER insertion)
        const foundProduct = await Product.findOne({ name: 'Mountain Bike Pro' });
        if (foundProduct) {
            foundProduct.greet();
            await foundProduct.toggleOnSale();
            console.log(`${foundProduct.name} is now ${foundProduct.onSale ? 'ON SALE!' : 'NOT on sale.'}`);
        } else {
            console.log("Product not found (but it should be!)");
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

seedAndFind(); // Call the unified async function

//const bike = new Product({name: 'Tire Pump', price: 20, category: 'Cycling'})
//bike.save()
 //   .then(data => {
 //       console.log("It worked!")
 //   })
 //   .catch(err => {
 //       console.log("ERROR!")
 //  });

 //Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: 100 }, { new: true })
 //.then(data => {
     //console.log('It worked!');
     //console.log(data);
 //})
 //.catch(err => {
     //console.log('Oh no,error!');
    // console.log(err);
 //})