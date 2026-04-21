using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient; 
using AutomationExercise.api.Models;
using System.ComponentModel;

namespace AutomationExercise.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProductsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            List<Product> products = new List<Product>();

            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = "SELECT ProductID, Name, Description, Price FROM Products";
                using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                {
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Product product = new Product
                            {
                                ProductID = Convert.ToInt32(reader["ProductID"]),
                                Name = reader["Name"].ToString() ?? "",
                                Description = reader["Description"].ToString() ?? "",
                                Price = Convert.ToDecimal(reader["Price"])
                            };
                            products.Add(product);
                        }
                    }
                }
            }
            return Ok(products);
        }
    }
}