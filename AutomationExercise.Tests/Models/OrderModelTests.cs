using AutomationExercise.api.Models;

namespace AutomationExercise.Tests.Models
{
    public class OrderModelTests
    {
        [Fact]
        public void Order_DefaultValues_AreCorrect()
        {
            var order = new Order();

            Assert.Equal(0, order.OrderID);
            Assert.Equal(0, order.OrderNumber);
            Assert.Equal(string.Empty, order.ShippingAddress);
            Assert.Null(order.Mentions);
            Assert.Null(order.OrderDate);
            Assert.Equal(0, order.TotalPrice);
            Assert.Equal(0, order.UserID);
            Assert.NotNull(order.OrderItems);
            Assert.Empty(order.OrderItems);
        }

        [Fact]
        public void Order_CanSetAllProperties()
        {
            var date = new DateTime(2026, 5, 12, 0, 0, 0, DateTimeKind.Utc);
            var order = new Order
            {
                OrderID = 1,
                OrderNumber = 123456,
                ShippingAddress = "123 Main St",
                Mentions = "Leave at door",
                OrderDate = date,
                TotalPrice = 99.99m,
                UserID = 7
            };

            Assert.Equal(1, order.OrderID);
            Assert.Equal(123456, order.OrderNumber);
            Assert.Equal("123 Main St", order.ShippingAddress);
            Assert.Equal("Leave at door", order.Mentions);
            Assert.Equal(date, order.OrderDate);
            Assert.Equal(99.99m, order.TotalPrice);
            Assert.Equal(7, order.UserID);
        }

        [Fact]
        public void Order_OrderItems_CanAddItems()
        {
            var order = new Order();
            order.OrderItems.Add(new OrderItem { ProductID = 1, Quantity = 2, UnitPrice = 25.99m });
            order.OrderItems.Add(new OrderItem { ProductID = 2, Quantity = 1, UnitPrice = 89.99m });

            Assert.Equal(2, order.OrderItems.Count);
        }

        [Fact]
        public void Order_TotalPrice_MatchesSumOfItems()
        {
            var order = new Order();
            order.OrderItems.Add(new OrderItem { Quantity = 2, UnitPrice = 25.99m });
            order.OrderItems.Add(new OrderItem { Quantity = 1, UnitPrice = 89.99m });

            var calculated = order.OrderItems.Sum(i => i.UnitPrice * i.Quantity);
            order.TotalPrice = calculated;

            Assert.Equal(141.97m, order.TotalPrice);
        }

        [Fact]
        public void Order_Mentions_CanBeNull()
        {
            var order = new Order { Mentions = null };
            Assert.Null(order.Mentions);
        }
    }
}
