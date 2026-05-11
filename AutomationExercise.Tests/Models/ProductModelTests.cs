using AutomationExercise.api.Models;

namespace AutomationExercise.Tests.Models
{
    public class ProductModelTests
    {
        [Fact]
        public void Product_DefaultValues_AreCorrect()
        {
            var product = new Product();

            Assert.Equal(0, product.ProductID);
            Assert.Equal(string.Empty, product.Name);
            Assert.Equal(string.Empty, product.Description);
            Assert.Equal(0, product.Price);
            Assert.Equal(string.Empty, product.ImageUrl);
            Assert.Equal("center", product.ImagePosition);
        }

        [Fact]
        public void Product_CanSetAllProperties()
        {
            var product = new Product
            {
                ProductID = 5,
                Name = "Wireless Mouse",
                Description = "Ergonomic wireless mouse",
                Price = 25.99m,
                ImageUrl = "https://images.unsplash.com/photo-123.jpg",
                ImagePosition = "top"
            };

            Assert.Equal(5, product.ProductID);
            Assert.Equal("Wireless Mouse", product.Name);
            Assert.Equal("Ergonomic wireless mouse", product.Description);
            Assert.Equal(25.99m, product.Price);
            Assert.Equal("https://images.unsplash.com/photo-123.jpg", product.ImageUrl);
            Assert.Equal("top", product.ImagePosition);
        }

        [Fact]
        public void Product_Price_SupportsDecimalPrecision()
        {
            var product = new Product { Price = 9.99m };

            Assert.Equal(9.99m, product.Price);
        }

        [Fact]
        public void Product_Name_CanBeUpdated()
        {
            var product = new Product { Name = "Old Name" };
            product.Name = "New Name";

            Assert.Equal("New Name", product.Name);
        }
    }
}
