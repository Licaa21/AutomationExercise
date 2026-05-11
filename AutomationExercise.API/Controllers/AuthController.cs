using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using AutomationExercise.API.DTOs;
using AutomationExercise.API.Services;

namespace AutomationExercise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;

        public AuthController(IConfiguration configuration, IJwtService jwtService)
        {
            _configuration = configuration;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto request)
        {         
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = "INSERT INTO Users (Username, Email, PasswordHash) VALUES (@Username, @Email, @Hash)";
                try
                { 
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Username", request.Username);
                        command.Parameters.AddWithValue("@Email", request.Email);
                        command.Parameters.AddWithValue("@Hash", passwordHash);
                        command.ExecuteNonQuery(); 
                        return Ok(new { message = "User registered successfully." });   
                    }
                }
                catch (Exception ex)                {
                    return BadRequest($"Error registering user: {ex.Message}");
                }
            }

            
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto request)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = "SELECT UserID, PasswordHash FROM Users WHERE Username = @Username";
                using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                {
                    command.Parameters.AddWithValue("@Username", request.Username);
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string storedHash = reader["PasswordHash"].ToString() ?? "";
                            if (BCrypt.Net.BCrypt.Verify(request.Password, storedHash))
                            {
                                string token = _jwtService.CreateToken(request.Username);
                                int userId = Convert.ToInt32(reader["UserID"]);
                                return Ok(new { Token = token, UserID = userId });
                            }
                        }
                    }
                }
            }

            return Unauthorized("Invalid username or password.");
        }
    }
}