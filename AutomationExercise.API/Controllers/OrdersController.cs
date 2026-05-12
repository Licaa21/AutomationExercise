using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient; 
using AutomationExercise.api.Models;
using Microsoft.AspNetCore.Authorization;

namespace AutomationExercise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public OrdersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            List<Order> orders = new List<Order>();

            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = "SELECT OrderID, OrderNumber, ShippingAddress, Mentions, OrderDate, TotalPrice, UserID FROM Orders";
                using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Order order = new Order
                            {
                                OrderID = Convert.ToInt32(reader["OrderID"]),
                                OrderNumber = Convert.ToInt32(reader["OrderNumber"]),
                                ShippingAddress = reader["ShippingAddress"].ToString() ?? "",
                                Mentions = reader["Mentions"].ToString(),
                                OrderDate = reader["OrderDate"] as DateTime?,
                                TotalPrice = Convert.ToDecimal(reader["TotalPrice"]),
                                UserID = Convert.ToInt32(reader["UserID"])
                            };
                            if (reader["OrderDate"] == DBNull.Value)
                            {
                                order.OrderDate = null;
                            }
                            else    
                            {
                                order.OrderDate = DateTime.SpecifyKind((DateTime)reader["OrderDate"], DateTimeKind.Utc);
                            }
                            orders.Add(order);
                        }
                    }
                }
            }
            return Ok(orders);
        }
        [HttpGet("user/{userId}")]
        public IActionResult GetOrdersByUser(int userId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            var orderDict = new Dictionary<int, Order>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = @"SELECT o.OrderID, o.OrderNumber, o.OrderDate, o.TotalPrice, o.ShippingAddress,
                                    oi.Quantity, oi.UnitPrice, oi.ProductID, p.Name, p.ImageUrl
                                    FROM Orders o
                                    JOIN OrderItems oi ON o.OrderID = oi.OrderID
                                    JOIN Products p ON oi.ProductID = p.ProductID
                                    WHERE o.UserID = @UserID
                                    ORDER BY o.OrderDate DESC";

                using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                {
                    command.Parameters.AddWithValue("@UserID", userId);
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int orderId = Convert.ToInt32(reader["OrderID"]);

                            if (!orderDict.ContainsKey(orderId))
                            {
                                orderDict[orderId] = new Order
                                {
                                    OrderID = orderId,
                                    OrderNumber = Convert.ToInt32(reader["OrderNumber"]),
                                    OrderDate = reader["OrderDate"] == DBNull.Value ? null : DateTime.SpecifyKind(Convert.ToDateTime(reader["OrderDate"]), DateTimeKind.Utc),
                                    TotalPrice = Convert.ToDecimal(reader["TotalPrice"]),
                                    ShippingAddress = reader["ShippingAddress"].ToString() ?? "",
                                    UserID = userId
                                };
                            }

                            orderDict[orderId].OrderItems.Add(new OrderItem
                            {
                                ProductID = Convert.ToInt32(reader["ProductID"]),
                                Quantity = Convert.ToInt32(reader["Quantity"]),
                                UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                                ProductName = reader["Name"].ToString() ?? "",
                                ImageUrl = reader["ImageUrl"].ToString() ?? ""
                            });
                        }
                    }
                }
            }

            return Ok(orderDict.Values.ToList());
        }


        [HttpPost]
        public IActionResult AddOrder([FromBody] Order order)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                decimal backendCalculatedTotal = 0;
                foreach (var item in order.OrderItems)
                {
                    SqlCommand priceCommand = new SqlCommand("SELECT Price FROM Products WHERE ProductID = @ProductID", connection);
                    priceCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                    var priceResult = priceCommand.ExecuteScalar();
                    if (priceResult != null)
                    {
                        decimal price = Convert.ToDecimal(priceResult);
                        item.UnitPrice = price;
                    }
                    else
                    {
                        return BadRequest($"Product with ID {item.ProductID} not found.");
                    }
                    backendCalculatedTotal += item.UnitPrice * item.Quantity;
                }
                string sqlQuery1 = "INSERT INTO Orders (OrderNumber, ShippingAddress, Mentions, OrderDate, TotalPrice, UserID) VALUES (@OrderNumber, @ShippingAddress, @Mentions, @OrderDate, @TotalPrice, @UserID);SELECT SCOPE_IDENTITY();";

                using (SqlCommand command = new SqlCommand(sqlQuery1, connection))
                {
                    command.Parameters.AddWithValue("@OrderNumber", order.OrderNumber);
                    command.Parameters.AddWithValue("@ShippingAddress", order.ShippingAddress);
                    command.Parameters.AddWithValue("@Mentions", (object?)order.Mentions ?? DBNull.Value);
                    command.Parameters.AddWithValue("@OrderDate", (object?)order.OrderDate ?? DBNull.Value);
                    command.Parameters.AddWithValue("@TotalPrice", backendCalculatedTotal);
                    command.Parameters.AddWithValue("@UserID", order.UserID);
                    int newOrderId = Convert.ToInt32(command.ExecuteScalar());
                    order.OrderID = newOrderId;
                }
                string sqlQuery2 = "INSERT INTO OrderItems (ProductID, OrderID, Quantity, UnitPrice) VALUES (@ProductID, @OrderID, @Quantity, @UnitPrice)";
                foreach (var item in order.OrderItems)
                {
                    using (SqlCommand command = new SqlCommand(sqlQuery2, connection))
                    {
                        command.Parameters.AddWithValue("@ProductID", item.ProductID);
                        command.Parameters.AddWithValue("@OrderID", order.OrderID);
                        command.Parameters.AddWithValue("@Quantity", item.Quantity);
                        command.Parameters.AddWithValue("@UnitPrice", item.UnitPrice);
                        command.ExecuteNonQuery();  
                        using (SqlCommand stockCommand = new SqlCommand("UPDATE Products SET Stock = Stock - @Quantity WHERE ProductID = @ProductID", connection))
                        {
                            stockCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                            stockCommand.Parameters.AddWithValue("@ProductID", item.ProductID);
                            stockCommand.ExecuteNonQuery();
                        }                  
                    }
                }
            }

            return Ok(new { message = "Order added successfully!" });
        }
    }
}