using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using AutomationExercise.API.DTOs;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace AutomationExercise.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto request)
        {         
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = "INSERT INTO Users (Username, Email, PasswordHash) VALUES (@Username, @Email, @Hash)";

                using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                {
                    command.Parameters.AddWithValue("@Username", request.Username);
                    command.Parameters.AddWithValue("@Email", request.Email);
                    command.Parameters.AddWithValue("@Hash", passwordHash);

                    connection.Open();
                    command.ExecuteNonQuery(); 
                }
            }

            return Ok("User registered successfully!");
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto request)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string sqlQuery = "SELECT PasswordHash FROM Users WHERE Username = @Username";
                using (SqlCommand command = new SqlCommand(sqlQuery, connection))
                {
                    command.Parameters.AddWithValue("@Username", request.Username);
                    connection.Open();
                    var result = command.ExecuteScalar();

                    if (result != null)
                    {
                        string storedHash = result.ToString() ?? "";
                        if (BCrypt.Net.BCrypt.Verify(request.Password, storedHash))
                        {
                            string token = CreateToken(request.Username);
                            return Ok(new { Token = token });
                        }
                    }
                }
            }

            return Unauthorized("Invalid username or password.");
        }
        private string CreateToken(string username)
        {
            var claims = new[]
            {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, username)
            };

            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature);

            var claimsList = new List<Claim>(claims);
            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claimsList,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }
    }
}