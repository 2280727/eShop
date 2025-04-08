import sequelize from "../db.js";
import _Products from './products.json' assert { type: 'json' };
import Product from "../models/Product.js";
import Rating from "../models/Rating.js";


(async () => {
    try {
      await sequelize.sync({ force: true})
        
      for (const item of _Products ){
        const product = await Product.create({
          title: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image
        })

        await Rating.create({
          productUuid: product.uuid,
          rate: item.rating.rate,
          count: item.rating.count
        })
      }
      console.log("Products and ratings seeded succecfully")
    } catch (error) {
      console.error('Seeding failed',error)
    } finally {
        await sequelize.close()
    }
})();