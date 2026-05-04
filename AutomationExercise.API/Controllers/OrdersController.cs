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

        [HttpPost]
        public IActionResult AddOrder([FromBody] Order order)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery1 = "INSERT INTO Orders (OrderNumber, ShippingAddress, Mentions, OrderDate, TotalPrice, UserID) VALUES (@OrderNumber, @ShippingAddress, @Mentions, @OrderDate, @TotalPrice, @UserID);SELECT SCOPE_IDENTITY();";

                using (SqlCommand command = new SqlCommand(sqlQuery1, connection))
                {
                    command.Parameters.AddWithValue("@OrderNumber", order.OrderNumber);
                    command.Parameters.AddWithValue("@ShippingAddress", order.ShippingAddress);
                    command.Parameters.AddWithValue("@Mentions", (object?)order.Mentions ?? DBNull.Value);
                    command.Parameters.AddWithValue("@OrderDate", (object?)order.OrderDate ?? DBNull.Value);
                    command.Parameters.AddWithValue("@TotalPrice", order.TotalPrice);
                    command.Parameters.AddWithValue("@UserID", order.UserID);

                    connection.Open();
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
                    }
                }
            }

            return Ok("Order added successfully!");
        }
    }
}