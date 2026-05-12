using AutomationExercise.api.Models;

namespace AutomationExercise.Tests.Models
{
    public class OrderItemModelTests
    {
        [Fact]
        public void OrderItem_DefaultValues_AreCorrect()
        {
            var item = new OrderItem();

            Assert.Equal(0, item.OrderItemID);
            Assert.Equal(0, item.ProductID);
            Assert.Equal(0, item.OrderID);
            Assert.Equal(0, item.Quantity);
            Assert.Equal(0, item.UnitPrice);
            Assert.Equal(string.Empty, item.ProductName);
            Assert.Equal(string.Empty, item.ImageUrl);
        }

        [Fact]
        public void OrderItem_CanSetAllProperties()
        {
            var item = new OrderItem
            {
                OrderItemID = 1,
                ProductID = 5,
                OrderID = 10,
                Quantity = 2,
                UnitPrice = 25.99m,
                ProductName = "Wireless Mouse",
                ImageUrl = "https://images.unsplash.com/photo-123.jpg"
            };

            Assert.Equal(1, item.OrderItemID);
            Assert.Equal(5, item.ProductID);
            Assert.Equal(10, item.OrderID);
            Assert.Equal(2, item.Quantity);
            Assert.Equal(25.99m, item.UnitPrice);
            Assert.Equal("Wireless Mouse", item.ProductName);
            Assert.Equal("https://images.unsplash.com/photo-123.jpg", item.ImageUrl);
        }

        [Fact]
        public void OrderItem_UnitPrice_SupportsDecimalPrecision()
        {
            var item = new OrderItem { UnitPrice = 9.99m };
            Assert.Equal(9.99m, item.UnitPrice);
        }

        [Fact]
        public void OrderItem_Subtotal_CalculatesCorrectly()
        {
            var item = new OrderItem { UnitPrice = 25.99m, Quantity = 3 };
            var subtotal = item.UnitPrice * item.Quantity;
            Assert.Equal(77.97m, subtotal);
        }
    }
}
